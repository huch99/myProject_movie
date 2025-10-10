package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "movie_id", nullable = false)
	private Movie movie;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "screen_id", nullable = false)
	private Screen screen;

	@Column(name = "start_time", nullable = false)
	private LocalDateTime startTime;

	@Column(name = "end_time", nullable = false)
	private LocalDateTime endTime;

	@Column(nullable = false)
	private Integer price;

	@Column(name = "available_seats", nullable = false)
	private Integer availableSeats;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ScheduleStatus status;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	// 상영 일정 상태 열거형
	public enum ScheduleStatus {
		OPEN, CLOSED, CANCELED
	}

	// JPA 엔티티 생명주기 콜백 메서드
	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
		if (this.status == null) {
			this.status = ScheduleStatus.OPEN;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	// 편의 메서드: 상영 시간 계산 (분 단위)
	@Transient
	public int getDurationMinutes() {
		return (int) java.time.Duration.between(startTime, endTime).toMinutes();
	}

	// 편의 메서드: 매진 여부 확인
	@Transient
	public boolean isSoldOut() {
		return this.availableSeats <= 0;
	}

	// 편의 메서드: 상영 가능 여부 확인
	@Transient
	public boolean isBookable() {
		return this.status == ScheduleStatus.OPEN && !isSoldOut() && startTime.isAfter(LocalDateTime.now());
	}

	public LocalDateTime getStartTime() {
		return startTime;
	}
}
