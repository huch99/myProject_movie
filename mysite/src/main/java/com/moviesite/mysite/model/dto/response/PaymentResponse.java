package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Payment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentResponse {
    
    private Long paymentId;
    private Long reservationId;
    private String reservationCode;
    private Long userId;
    private String userName;
    private BigDecimal amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private String cardCompany;
    private String cardNumber;
    private Integer installment;
    private BigDecimal discountAmount;
    private Long couponId;
    private String couponName;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime paymentTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime refundTime;
    
    private String formattedPaymentTime;
    private String formattedRefundTime;
    private boolean completed;
    private boolean refundable;
    
    // 영화 정보
    private Long movieId;
    private String movieTitle;
    
    // 상영 정보
    private Long scheduleId;
    private LocalDateTime screeningTime;
    private String formattedScreeningTime;
    
    // Entity -> DTO 변환 메서드
    public static PaymentResponse fromEntity(Payment payment) {
        if (payment == null) {
            return null;
        }
        
        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .reservationId(payment.getReservation().getId())
                .userId(payment.getUser().getId())
                .userName(payment.getUser().getName())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus().name())
                .transactionId(payment.getTransactionId())
                .cardCompany(payment.getCardCompany())
                .cardNumber(payment.getCardNumber())
                .installment(payment.getInstallment())
                .discountAmount(payment.getDiscountAmount())
                .couponId(payment.getCoupon() != null ? payment.getCoupon().getId() : null)
                .couponName(payment.getCoupon() != null ? payment.getCoupon().getName() : null)
                .paymentTime(payment.getPaymentTime())
                .refundTime(payment.getRefundTime())
                .formattedPaymentTime(payment.getPaymentTime() != null ? 
                        payment.getPaymentTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .formattedRefundTime(payment.getRefundTime() != null ? 
                        payment.getRefundTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .completed(payment.isCompleted())
                .refundable(payment.isRefundable())
                .movieId(payment.getReservation().getSchedule().getMovie().getId())
                .movieTitle(payment.getReservation().getSchedule().getMovie().getTitle())
                .scheduleId(payment.getReservation().getSchedule().getId())
                .screeningTime(payment.getReservation().getSchedule().getStartTime())
                .formattedScreeningTime(payment.getReservation().getSchedule().getStartTime() != null ?
                        payment.getReservation().getSchedule().getStartTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .build();
    }
}