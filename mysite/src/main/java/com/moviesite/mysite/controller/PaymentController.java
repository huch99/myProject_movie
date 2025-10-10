package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.PaymentRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.PaymentResponse;
import com.moviesite.mysite.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // 결제 처리
    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        PaymentResponse payment = paymentService.processPayment(paymentRequest);
        return new ResponseEntity<>(ApiResponse.success("결제가 성공적으로 처리되었습니다.", payment), HttpStatus.CREATED);
    }

    // 특정 결제 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(@PathVariable Long id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    // 현재 로그인한 사용자의 결제 내역 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getMyPayments() {
        List<PaymentResponse> payments = paymentService.getMyPayments();
        return ResponseEntity.ok(ApiResponse.success(payments));
    }

    // 특정 예매의 결제 정보 조회
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByReservationId(@PathVariable Long reservationId) {
        PaymentResponse payment = paymentService.getPaymentByReservationId(reservationId);
        return ResponseEntity.ok(ApiResponse.success(payment));
    }

    // 결제 취소/환불
    @PostMapping("/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentResponse>> refundPayment(@PathVariable Long id) {
        PaymentResponse refundedPayment = paymentService.refundPayment(id);
        return ResponseEntity.ok(ApiResponse.success("환불이 성공적으로 처리되었습니다.", refundedPayment));
    }

    // 관리자: 모든 결제 내역 조회
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String method,
            Pageable pageable) {
        Page<PaymentResponse> payments = paymentService.getAllPayments(status, method, pageable);
        return ResponseEntity.ok(ApiResponse.success(payments));
    }
}