package com.moviesite.mysite.model.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "movies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
    private String title;
    
    @Column(name = "title_en")
    private String titleEn;
    
    private String director;
    
    @Column(columnDefinition = "TEXT")
    private String actors;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String genre;
    
    @Column(name = "running_time", nullable = false)
    private Integer runningTime;
    
    @Column(name = "release_date", nullable = false)
    private LocalDate releaseDate;
    
    @Column(name = "end_date")
    private LocalDate endDate;
    
    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal rating;
    
    @Column(columnDefinition = "TEXT")
    private String synopsis;
    
    @Column(name = "poster_url")
    private String posterUrl;
    
    @Column(name = "background_url")
    private String backgroundUrl;
    
    @Column(name = "trailer_url")
    private String trailerUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovieStatus status;
    
    @Column(name = "age_rating", nullable = false)
    private String ageRating;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
 // 편의 메서드: 쉼표로 구분된 문자열을 리스트로 변환
    @Transient
    public List<String> getGenreList() {
        if (this.genre == null || this.genre.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(this.genre.split(","));
    }
    
    @Transient
    public List<String> getActorsList() {
        if (this.actors == null || this.actors.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(this.actors.split(","));
    }
    
 // 영화 상영 상태 열거형
    public enum MovieStatus {
        COMING_SOON, NOW_SHOWING, ENDED
    }
    
    // 프론트엔드의 isShowing 필드를 위한 편의 메서드
    @Transient
    public boolean isShowing() {
        return this.status == MovieStatus.NOW_SHOWING;
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
