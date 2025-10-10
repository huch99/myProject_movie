package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "screenings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Screening {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;
    
    @Column(name = "screening_date", nullable = false)
    private LocalDate screeningDate;
    
    @Column(name = "screening_time", nullable = false)
    private LocalTime screeningTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Column(name = "is_full", nullable = false)
    private Boolean isFull;
    
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScreeningStatus status;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // 상영 상태 열거형
    public enum ScreeningStatus {
        ACTIVE, CANCELED, COMPLETED
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isFull == null) {
            this.isFull = false;
        }
        if (this.status == null) {
            this.status = ScreeningStatus.ACTIVE;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 편의 메서드: 예매 가능 여부 확인
    @Transient
    public boolean isBookable() {
        return this.status == ScreeningStatus.ACTIVE && 
               !this.isFull && 
               this.availableSeats > 0 &&
               LocalDateTime.of(screeningDate, screeningTime).isAfter(LocalDateTime.now());
    }
    
    // 편의 메서드: 상영 취소 여부 확인
    @Transient
    public boolean isCanceled() {
        return this.status == ScreeningStatus.CANCELED;
    }
    
    // 편의 메서드: 상영 완료 여부 확인
    @Transient
    public boolean isCompleted() {
        return this.status == ScreeningStatus.COMPLETED || 
               LocalDateTime.of(screeningDate, endTime).isBefore(LocalDateTime.now());
    }

}
