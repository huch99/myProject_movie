package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.PaymentRequest;
import com.moviesite.mysite.model.dto.response.PaymentResponse;
import com.moviesite.mysite.service.PaymentService;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {
	@Autowired
	private PaymentService paymentService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        List<PaymentResponse> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        PaymentResponse payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }
    
    @PostMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> processPayment(
            @PathVariable Long bookingId,
            @RequestBody PaymentRequest paymentRequest) {
        PaymentResponse processedPayment = paymentService.processPayment(bookingId, paymentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(processedPayment);
    }
    
    @PutMapping("/{id}/refund")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> refundPayment(@PathVariable Long id) {
        PaymentResponse refundedPayment = paymentService.refundPayment(id);
        return ResponseEntity.ok(refundedPayment);
    }
    
    @GetMapping("/booking/{bookingId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> getPaymentByBooking(@PathVariable Long bookingId) {
        PaymentResponse payment = paymentService.getPaymentByBooking(bookingId);
        return ResponseEntity.ok(payment);
    }
}
