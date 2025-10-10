package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.PaymentRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.PaymentResponse;
import com.moviesite.mysite.model.entity.Coupon;
import com.moviesite.mysite.model.entity.Payment;
import com.moviesite.mysite.model.entity.Payment.PaymentStatus;
import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.CouponRepository;
import com.moviesite.mysite.repository.PaymentRepository;
import com.moviesite.mysite.repository.ReservationRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    // 결제 처리
    @Transactional
    public PaymentResponse processPayment(PaymentRequest paymentRequest) {
        // 예매 정보 조회
        Reservation reservation = reservationRepository.findById(paymentRequest.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + paymentRequest.getReservationId()));
        
        // 현재 사용자 조회
        User currentUser = getCurrentUser();
        
        // 예매 소유자 확인
        if (!reservation.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("해당 예매에 대한 결제 권한이 없습니다");
        }
        
        // 할인 금액 계산
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon coupon = null;
        
        if (paymentRequest.getCouponId() != null) {
            coupon = couponRepository.findById(paymentRequest.getCouponId())
                    .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + paymentRequest.getCouponId()));
            
            // 쿠폰 유효성 검증 로직 추가 필요
            discountAmount = coupon.calculateDiscount(reservation.getTotalPrice());
        } else if (paymentRequest.getDiscountAmount() != null) {
            discountAmount = paymentRequest.getDiscountAmount();
        }
        
        // 최종 결제 금액 계산
        BigDecimal finalAmount = reservation.getTotalPrice().subtract(discountAmount);
        
        // 결제 정보 생성
        Payment payment = Payment.builder()
                .reservation(reservation)
                .user(currentUser)
                .amount(finalAmount)
                .paymentMethod(paymentRequest.getPaymentMethod())
                .paymentStatus(PaymentStatus.COMPLETED)
                .transactionId(paymentRequest.getTransactionId())
                .cardCompany(paymentRequest.getCardCompany())
                .cardNumber(paymentRequest.getCardNumber())
                .installment(paymentRequest.getInstallment())
                .discountAmount(discountAmount)
                .coupon(coupon)
                .paymentTime(LocalDateTime.now())
                .build();
        
        Payment savedPayment = paymentRepository.save(payment);
        
        // 예매 상태 업데이트
        reservation.setPaymentMethod(paymentRequest.getPaymentMethod());
        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        reservation.setPaymentStatus(Reservation.PaymentStatus.PAID);
        reservationRepository.save(reservation);
        
        return PaymentResponse.fromEntity(savedPayment);
    }

    // 특정 결제 정보 조회
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        // 결제 소유자 확인
        validatePaymentOwnership(payment);
        
        return PaymentResponse.fromEntity(payment);
    }

    // 현재 로그인한 사용자의 결제 내역 조회
    public List<PaymentResponse> getMyPayments() {
        User currentUser = getCurrentUser();
        List<Payment> payments = paymentRepository.findByUserOrderByPaymentTimeDesc(currentUser);
        
        return payments.stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 예매의 결제 정보 조회
    public PaymentResponse getPaymentByReservationId(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        
        // 예매 소유자 확인
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !reservation.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("해당 예매의 결제 정보에 접근할 권한이 없습니다");
        }
        
        Payment payment = paymentRepository.findByReservation(reservation)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for reservation id: " + reservationId));
        
        return PaymentResponse.fromEntity(payment);
    }

    // 결제 취소/환불
    @Transactional
    public PaymentResponse refundPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        // 결제 소유자 확인
        validatePaymentOwnership(payment);
        
        // 환불 가능 여부 확인
        if (!payment.isRefundable()) {
            throw new BadRequestException("환불 가능한 결제가 아닙니다");
        }
        
        // 결제 상태 업데이트
        payment.setPaymentStatus(PaymentStatus.REFUNDED);
        payment.setRefundTime(LocalDateTime.now());
        
        // 예매 상태 업데이트
        Reservation reservation = payment.getReservation();
        reservation.setStatus(Reservation.ReservationStatus.CANCELED);
        reservation.setPaymentStatus(Reservation.PaymentStatus.REFUNDED);
        
        reservationRepository.save(reservation);
        Payment refundedPayment = paymentRepository.save(payment);
        
        return PaymentResponse.fromEntity(refundedPayment);
    }

    // 관리자: 모든 결제 내역 조회
    public Page<PaymentResponse> getAllPayments(String status, String method, Pageable pageable) {
        // 현재 사용자가 관리자인지 확인
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        Page<Payment> payments;
        
        if (status != null && method != null) {
            PaymentStatus paymentStatus = PaymentStatus.valueOf(status);
            payments = paymentRepository.findByPaymentStatusAndPaymentMethod(paymentStatus, method, pageable);
        } else if (status != null) {
            PaymentStatus paymentStatus = PaymentStatus.valueOf(status);
            payments = paymentRepository.findByPaymentStatus(paymentStatus, pageable);
        } else if (method != null) {
            payments = paymentRepository.findByPaymentMethod(method, pageable);
        } else {
            payments = paymentRepository.findAll(pageable);
        }
        
        return payments.map(PaymentResponse::fromEntity);
    }
    
    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    // 결제 소유권 확인
    private void validatePaymentOwnership(Payment payment) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !payment.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("해당 결제 정보에 접근할 권한이 없습니다");
        }
    }
}