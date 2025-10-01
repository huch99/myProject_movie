package com.moviesite.mysite.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.PaymentRequest;
import com.moviesite.mysite.model.dto.response.*;
import com.moviesite.mysite.model.entity.Booking;
import com.moviesite.mysite.model.entity.Booking.BookingStatus;
import com.moviesite.mysite.model.entity.Payment;
import com.moviesite.mysite.model.entity.Payment.PaymentStatus;
import com.moviesite.mysite.repository.BookingRepository;
import com.moviesite.mysite.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
	@Autowired
	private PaymentRepository paymentRepository;
    private BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        // 권한 확인 로직 추가 (본인 결제 or ADMIN)
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!payment.getBooking().getUser().getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to view this payment.");
        }
        return PaymentResponse.fromEntity(payment);
    }

    @Transactional
    public PaymentResponse processPayment(Long bookingId, PaymentRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!booking.getUser().getUsername().equals(currentUsername)) {
            throw new BadRequestException("You do not have permission to process payment for this booking.");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new BadRequestException("Booking is not in PENDING status for payment.");
        }
        if (booking.getPayment() != null && booking.getPayment().getStatus() == PaymentStatus.COMPLETED) {
            throw new BadRequestException("Payment for this booking has already been completed.");
        }

        // 결제 금액 일치 여부 확인 (클라이언트에서 받은 금액과 실제 예약 금액 비교)
        if (!booking.getTotalPrice().equals(request.getAmount())) {
            throw new BadRequestException("Payment amount does not match booking total price.");
        }

        // 실제 PG사 연동 로직이 들어갈 부분 (여기서는 성공했다고 가정)
        // PG사 연동 결과에 따라 PaymentStatus를 COMPLETED 또는 FAILED로 설정
        PaymentStatus paymentStatus = PaymentStatus.COMPLETED; // 가상으로 성공

        Payment payment = Payment.builder()
                .booking(booking)
                .paymentNumber(generatePaymentNumber())
                .paymentMethod(request.getPaymentMethod())
                .amount(request.getAmount())
                .status(paymentStatus)
                .paymentDate(LocalDateTime.now())
                .build();
        Payment savedPayment = paymentRepository.save(payment);

        // 결제 성공 시 예약 상태 변경
        if (paymentStatus == PaymentStatus.COMPLETED) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);
        }

        return PaymentResponse.fromEntity(savedPayment);
    }

    @Transactional
    public PaymentResponse refundPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!payment.getBooking().getUser().getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to refund this payment.");
        }

        if (payment.getStatus() != PaymentStatus.COMPLETED) {
            throw new BadRequestException("Only completed payments can be refunded.");
        }
        
        // TODO: 실제 PG사 환불 API 호출 로직
        // 가상으로 환불 성공
        payment.setStatus(PaymentStatus.REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment refundedPayment = paymentRepository.save(payment);

        // 예약 상태도 취소로 변경 (BookingService에서 처리할 수도 있습니다.)
        Booking booking = payment.getBooking();
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        return PaymentResponse.fromEntity(refundedPayment);
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentByBooking(Long bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for booking id: " + bookingId));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!payment.getBooking().getUser().getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to view this payment.");
        }
        return PaymentResponse.fromEntity(payment);
    }

    private String generatePaymentNumber() {
        return "PAY" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}
