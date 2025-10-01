package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.PaymentRequest;
import com.moviesite.mysite.model.dto.response.PaymentResponse;
import com.moviesite.mysite.model.entity.Booking;
import com.moviesite.mysite.model.entity.Payment;

@Component
public class PaymentMapper {
	public PaymentResponse toResponse(Payment payment) {
	    PaymentResponse response = new PaymentResponse();
	    response.setId(payment.getId());
	    response.setPaymentNumber(payment.getPaymentNumber());
	    response.setBookingId(payment.getBooking().getId());
	    response.setPaymentMethod(payment.getPaymentMethod().name());
	    response.setAmount(payment.getAmount());
	    response.setStatus(payment.getStatus().name());
	    response.setPaymentDate(payment.getPaymentDate());
	    return response;
	}
    
    public List<PaymentResponse> toResponseList(List<Payment> payments) {
        return payments.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public Payment toEntity(PaymentRequest request, Booking booking) {
        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setPaymentNumber(generatePaymentNumber());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(request.getAmount());
        payment.setStatus(Payment.PaymentStatus.PENDING); // 초기 상태는 PENDING
        return payment;
    }
    
    private String generatePaymentNumber() {
        return "PAY" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}
