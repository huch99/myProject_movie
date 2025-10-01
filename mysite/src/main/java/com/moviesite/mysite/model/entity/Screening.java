package com.moviesite.mysite.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screenings")
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
	    
	    @Column(nullable = false)
	    private LocalDateTime startTime;
	    
	    @Column(nullable = false)
	    private LocalDateTime endTime;
	    
	    @Column(nullable = false)
	    private Integer basePrice;
	    
	    @OneToMany(mappedBy = "screening", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	    private List<Booking> bookings = new ArrayList<>();
	    
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
	    
	    public Movie getMovie() {
	        return movie;
	    }
	    
	    public Screen getScreen() {
	        return screen;
	    }
	    
	    public LocalDateTime getStartTime() {
	        return startTime;
	    }
	    
	    public LocalDateTime getEndTime() {
	        return endTime;
	    }
	    
	    public Integer getBasePrice() {
	        return basePrice;
	    }
	    
	    public List<Booking> getBookings() {
	        return bookings;
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
	    
	    public void setMovie(Movie movie) {
	        this.movie = movie;
	    }
	    
	    public void setScreen(Screen screen) {
	        this.screen = screen;
	    }
	    
	    public void setStartTime(LocalDateTime startTime) {
	        this.startTime = startTime;
	    }
	    
	    public void setEndTime(LocalDateTime endTime) {
	        this.endTime = endTime;
	    }
	    
	    public void setBasePrice(Integer basePrice) {
	        this.basePrice = basePrice;
	    }
	    
	    public void setBookings(List<Booking> bookings) {
	        this.bookings = bookings;
	    }
	    
	    public void setCreatedAt(LocalDateTime createdAt) {
	        this.createdAt = createdAt;
	    }
	    
	    public void setUpdatedAt(LocalDateTime updatedAt) {
	        this.updatedAt = updatedAt;
	    }
}
