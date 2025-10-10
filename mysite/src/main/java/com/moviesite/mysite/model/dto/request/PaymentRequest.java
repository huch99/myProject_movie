package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    
    @NotNull(message = "예매 ID는 필수 입력값입니다")
    private Long reservationId;
    
    @NotBlank(message = "결제 방법은 필수 입력값입니다")
    private String paymentMethod; // "CARD", "MOBILE", "BANK", "POINT" 등
    
    private String transactionId; // PG사 결제 트랜잭션 ID
    
    // 카드 결제 시 필요한 정보
    private String cardCompany;
    private String cardNumber; // 마스킹된 카드 번호
    private Integer installment; // 할부 개월 수
    
    // 할인 정보
    private BigDecimal discountAmount;
    private Long couponId;
}