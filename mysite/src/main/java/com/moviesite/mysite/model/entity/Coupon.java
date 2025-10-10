package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "coupon_code", nullable = false, unique = true)
    private String couponCode;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;
    
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    
    @Column(name = "min_order_price", precision = 10, scale = 2)
    private BigDecimal minOrderPrice;
    
    @Column(name = "max_discount_amount", precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;
    
    @Column(name = "issue_date", nullable = false)
    private LocalDateTime issueDate;
    
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;
    
    @Column(name = "usage_limit_per_user")
    private Integer usageLimitPerUser;
    
    @Column(name = "total_usage_limit")
    private Integer totalUsageLimit;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "coupon_type", nullable = false)
    private CouponType couponType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_movie_id")
    private Movie targetMovie;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_theater_id")
    private Theater targetTheater;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CouponStatus status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 할인 유형 열거형
    public enum DiscountType {
        PERCENT, AMOUNT
    }
    
    // 쿠폰 종류 열거형
    public enum CouponType {
        GENERAL, WELCOME, EVENT, MOVIE_SPECIFIC, THEATER_SPECIFIC
    }
    
    // 쿠폰 상태 열거형
    public enum CouponStatus {
        ACTIVE, EXPIRED, DISABLED
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = CouponStatus.ACTIVE;
        }
        if (this.minOrderPrice == null) {
            this.minOrderPrice = BigDecimal.ZERO;
        }
        if (this.usageLimitPerUser == null) {
            this.usageLimitPerUser = 1;
        }
        if (this.couponType == null) {
            this.couponType = CouponType.GENERAL;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 편의 메서드: 쿠폰 유효 여부 확인
    @Transient
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return this.status == CouponStatus.ACTIVE &&
               now.isAfter(this.issueDate) &&
               now.isBefore(this.expiryDate);
    }
    
    // 편의 메서드: 할인 금액 계산
    @Transient
    public BigDecimal calculateDiscount(BigDecimal orderAmount) {
        if (orderAmount.compareTo(this.minOrderPrice) < 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal discountAmount;
        if (this.discountType == DiscountType.PERCENT) {
            discountAmount = orderAmount.multiply(this.discountValue).divide(new BigDecimal(100));
            if (this.maxDiscountAmount != null && discountAmount.compareTo(this.maxDiscountAmount) > 0) {
                discountAmount = this.maxDiscountAmount;
            }
        } else {
            discountAmount = this.discountValue;
            if (discountAmount.compareTo(orderAmount) > 0) {
                discountAmount = orderAmount;
            }
        }
        
        return discountAmount;
    }
}
