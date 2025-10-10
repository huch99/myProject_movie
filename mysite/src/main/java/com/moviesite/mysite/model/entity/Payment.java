package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;
    
    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "card_company")
    private String cardCompany;
    
    @Column(name = "card_number")
    private String cardNumber;
    
    private Integer installment;
    
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;
    
    @Column(name = "payment_time")
    private LocalDateTime paymentTime;
    
    @Column(name = "refund_time")
    private LocalDateTime refundTime;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 결제 상태 열거형
    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED, CANCELED
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.discountAmount == null) {
            this.discountAmount = BigDecimal.ZERO;
        }
        if (this.installment == null) {
            this.installment = 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 편의 메서드: 결제 완료 여부 확인
    @Transient
    public boolean isCompleted() {
        return this.paymentStatus == PaymentStatus.COMPLETED;
    }
    
    // 편의 메서드: 환불 가능 여부 확인
    @Transient
    public boolean isRefundable() {
        return this.paymentStatus == PaymentStatus.COMPLETED && 
               this.reservation != null && 
               this.reservation.isCancelable();
    }
}
