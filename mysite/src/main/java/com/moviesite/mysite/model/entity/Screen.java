package com.moviesite.mysite.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "screens")
public class Screen {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer seatsRow;
    
    @Column(nullable = false)
    private Integer seatsColumn;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScreenType screenType;
    
    @Column(nullable = false)
    private Integer totalSeats;
    
    @OneToMany(mappedBy = "screen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Seat> seats = new ArrayList<>();
    
    @OneToMany(mappedBy = "screen", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Screening> screenings = new ArrayList<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public enum ScreenType {
        TWO_D("2D"), 
        THREE_D("3D"), 
        IMAX("IMAX"), 
        FOUR_DX("4DX"), 
        SCREENX("SCREENX");
        
        private final String displayName;
        
        ScreenType(String displayName) {
            this.displayName = displayName;
        }
        
        public String getDisplayName() {
            return displayName;
        }
    }
    
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
    
    public Theater getTheater() {
        return theater;
    }
    
    public String getName() {
        return name;
    }
    
    public Integer getSeatsRow() {
        return seatsRow;
    }
    
    public Integer getSeatsColumn() {
        return seatsColumn;
    }
    
    public ScreenType getScreenType() {
        return screenType;
    }
    
    public Integer getTotalSeats() {
        return totalSeats;
    }
    
    public List<Seat> getSeats() {
        return seats;
    }
    
    public List<Screening> getScreenings() {
        return screenings;
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
    
    public void setTheater(Theater theater) {
        this.theater = theater;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public void setSeatsRow(Integer seatsRow) {
        this.seatsRow = seatsRow;
    }
    
    public void setSeatsColumn(Integer seatsColumn) {
        this.seatsColumn = seatsColumn;
    }
    
    public void setScreenType(ScreenType screenType) {
        this.screenType = screenType;
    }
    
    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }
    
    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
    
    public void setScreenings(List<Screening> screenings) {
        this.screenings = screenings;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
