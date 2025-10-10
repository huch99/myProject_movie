package com.moviesite.mysite.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "screens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Screen {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id", nullable = false)
    private Theater theater;
    
    @Column(nullable = false)
    private String name;
    
    private String type;
    
    @Column(name = "seats_count", nullable = false)
    private Integer seatsCount;
    
    @Column(name = "row_count", nullable = false)
    private Integer rowCount;
    
    @Column(name = "column_count", nullable = false)
    private Integer columnCount;
    
    @Column(name = "screen_size")
    private String screenSize;
    
    @Column(name = "audio_system")
    private String audioSystem;
    
    @Column(name = "is_accessible")
    private Boolean isAccessible;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.isAccessible == null) {
            this.isAccessible = true;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
