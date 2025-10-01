package com.moviesite.mysite.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "movies")
public class Movie {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false)
	private String title;
	
	private String titleEn;
	
	private String director;
	
	@Column(columnDefinition = "TEXT")
	private String actors;
	
	private String genre;
	
	@Column(nullable = false)
	private Integer runningTime;
	
	@Column(nullable = false)
	private LocalDate releaseDate;
	
	private LocalDate endDate;
	
	@Column(nullable = false)
	private String rating;
	
	@Column(columnDefinition = "TEXT")
	private String synopsis;
	
	private String posterUrl;
	
	private String backgroundUrl;
	
	private String trailerUrl;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private MovieStatus status;
	
	private LocalDateTime createdAt;
	
	private LocalDateTime updatedAt;
	
	public enum MovieStatus {
		COMING_SOON, NOW_SHOWING, ENDED
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
    
    public String getTitle() {
        return title;
    }
    
    public String getTitleEn() {
        return titleEn;
    }
    
    public String getDirector() {
        return director;
    }
    
    public String getActors() {
        return actors;
    }
    
    public String getGenre() {
        return genre;
    }
    
    public Integer getRunningTime() {
        return runningTime;
    }
    
    public LocalDate getReleaseDate() {
        return releaseDate;
    }
    
    public LocalDate getEndDate() {
        return endDate;
    }
    
    public String getRating() {
        return rating;
    }
    
    public String getSynopsis() {
        return synopsis;
    }
    
    public String getPosterUrl() {
        return posterUrl;
    }
    
    public String getBackgroundUrl() {
        return backgroundUrl;
    }
    
    public String getTrailerUrl() {
        return trailerUrl;
    }
    
    public MovieStatus getStatus() {
        return status;
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
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }
    
    public void setDirector(String director) {
        this.director = director;
    }
    
    public void setActors(String actors) {
        this.actors = actors;
    }
    
    public void setGenre(String genre) {
        this.genre = genre;
    }
    
    public void setRunningTime(Integer runningTime) {
        this.runningTime = runningTime;
    }
    
    public void setReleaseDate(LocalDate releaseDate) {
        this.releaseDate = releaseDate;
    }
    
    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
    
    public void setRating(String rating) {
        this.rating = rating;
    }
    
    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    }
    
    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }
    
    public void setBackgroundUrl(String backgroundUrl) {
        this.backgroundUrl = backgroundUrl;
    }
    
    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }
    
    public void setStatus(MovieStatus status) {
        this.status = status;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
