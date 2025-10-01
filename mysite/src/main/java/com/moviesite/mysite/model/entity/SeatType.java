package com.moviesite.mysite.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "seat_types")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer priceAdditional;
    
    private String description;
    
    @OneToMany(mappedBy = "seatType", fetch = FetchType.LAZY)
    private List<Seat> seats = new ArrayList<>();
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (priceAdditional == null) {
            priceAdditional = 0;
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

    public String getName() {
        return name;
    }

    public Integer getPriceAdditional() {
        return priceAdditional;
    }

    public String getDescription() {
        return description;
    }

    public List<Seat> getSeats() {
        return seats;
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

    public void setName(String name) {
        this.name = name;
    }

    public void setPriceAdditional(Integer priceAdditional) {
        this.priceAdditional = priceAdditional;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
