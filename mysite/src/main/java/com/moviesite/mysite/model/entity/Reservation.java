package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;
    
    @Column(name = "reservation_time", nullable = false)
    private LocalDateTime reservationTime;
    
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;
    
    @Column(name = "number_of_tickets", nullable = false)
    private Integer numberOfTickets;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 예매 상태 열거형
    public enum ReservationStatus {
        PENDING, CONFIRMED, CANCELED
    }
    
    // 결제 상태 열거형
    public enum PaymentStatus {
        PENDING, PAID, REFUNDED
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.reservationTime == null) {
            this.reservationTime = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = ReservationStatus.PENDING;
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.PENDING;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 편의 메서드: 예매 취소 가능 여부 확인 (상영 시작 1시간 전까지 취소 가능)
    @Transient
    public boolean isCancelable() {
        LocalDateTime screeningStartTime = this.schedule.getStartTime();
        LocalDateTime cancelDeadline = screeningStartTime.minusHours(1);
        return LocalDateTime.now().isBefore(cancelDeadline) && 
               (this.status == ReservationStatus.CONFIRMED || this.status == ReservationStatus.PENDING);
    }
    
    // 편의 메서드: 예매 확인 여부
    @Transient
    public boolean isConfirmed() {
        return this.status == ReservationStatus.CONFIRMED;
    }
}
