package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "screen_id", nullable = false)
	private Screen screen;

	@Column(name = "row_name", nullable = false)
	private String rowName;

	@Column(name = "column_number", nullable = false)
	private Integer columnNumber;

	@Enumerated(EnumType.STRING)
	@Column(name = "seat_type", nullable = false)
	private SeatType seatType;

	@Column(name = "is_active", nullable = false)
	private Boolean isActive;

	@Column(name = "created_at")
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	// 좌석 타입 열거형
	public enum SeatType {
		STANDARD, PREMIUM, HANDICAPPED, COUPLE
	}

	// JPA 엔티티 생명주기 콜백 메서드
	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
		if (this.isActive == null) {
			this.isActive = true;
		}
		if (this.seatType == null) {
			this.seatType = SeatType.STANDARD;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	// 편의 메서드: 좌석 표기 (예: A1, B5 등)
	@Transient
	public String getSeatLabel() {
		return this.rowName + this.columnNumber;
	}

	public String getSeatNumber() {
		// TODO Auto-generated method stub
		return null;
	}
}
