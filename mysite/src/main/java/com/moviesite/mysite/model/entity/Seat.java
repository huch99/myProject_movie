package com.moviesite.mysite.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seats")
public class Seat {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "screen_id", nullable = false)
    private Screen screen;
    
    @Column(nullable = false)
    private Character seatRow;
    
    @Column(nullable = false)
    private Integer seatNumber;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_type_id", nullable = false)
    private SeatType seatType;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @OneToMany(mappedBy = "seat", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<BookingSeat> bookingSeats = new ArrayList<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) {
            isActive = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
 // Getter 메서드
    public Long getId() {
        return id;
    }

    public Screen getScreen() {
        return screen;
    }

    public Character getSeatRow() {
        return seatRow;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public SeatType getSeatType() {
        return seatType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public List<BookingSeat> getBookingSeats() {
        return bookingSeats;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setter 메서드
    public void setId(Long id) {
        this.id = id;
    }

    public void setScreen(Screen screen) {
        this.screen = screen;
    }

    public void setSeatRow(Character seatRow) {
        this.seatRow = seatRow;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public void setSeatType(SeatType seatType) {
        this.seatType = seatType;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setBookingSeats(List<BookingSeat> bookingSeats) {
        this.bookingSeats = bookingSeats;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // filter 메서드에서 사용하기 위한 추가 메서드
    public boolean isActive() {
        return isActive != null && isActive;
    }
}