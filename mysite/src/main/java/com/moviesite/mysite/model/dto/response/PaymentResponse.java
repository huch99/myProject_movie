package com.moviesite.mysite.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

import com.moviesite.mysite.model.entity.Payment;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
	private Long id;
    private String paymentNumber;
    private Long bookingId;
    private String paymentMethod;
    private Integer amount;
    private String status;
    private LocalDateTime paymentDate;

    public static PaymentResponse fromEntity(Payment payment) {
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
    
 // Getter 메서드
    public Long getId() {
        return id;
    }

    public String getPaymentNumber() {
        return paymentNumber;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public Integer getAmount() {
        return amount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    // Setter 메서드
    public void setId(Long id) {
        this.id = id;
    }

    public void setPaymentNumber(String paymentNumber) {
        this.paymentNumber = paymentNumber;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}
