package com.moviesite.mysite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "booking_seats")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSeat {
    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;
    
    @Column(nullable = false)
    private Integer price;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Getter 메서드
    public Long getId() {
        return id;
    }
    
    public Booking getBooking() {
        return booking;
    }
    
    public Seat getSeat() {
        return seat;
    }
    
    public Integer getPrice() {
        return price;
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
    
    public void setBooking(Booking booking) {
        this.booking = booking;
    }
    
    public void setSeat(Seat seat) {
        this.seat = seat;
    }
    
    public void setPrice(Integer price) {
        this.price = price;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}