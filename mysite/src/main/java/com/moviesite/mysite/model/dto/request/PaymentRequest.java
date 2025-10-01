package com.moviesite.mysite.model.dto.request;

import com.moviesite.mysite.model.entity.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
	private Payment.PaymentMethod paymentMethod;
	private Integer amount; // 실제로는 BookingService에서 계산하여 전달
	// 결제에 필요한 카드 정보, 은행 정보 등은 보안상 민감하여 직접 DTO로 받기보다 외부 결제 PG사를 연동하여 처리
	// 예시에서는 PG사 연동 후 최종 결과만 DTO로 받아 처리하는 형태를 가정합니다.

	// Getter 메서드
	public Payment.PaymentMethod getPaymentMethod() {
		return paymentMethod;
	}

	public Integer getAmount() {
		return amount;
	}

	// Setter 메서드
	public void setPaymentMethod(Payment.PaymentMethod paymentMethod) {
		this.paymentMethod = paymentMethod;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}
}
