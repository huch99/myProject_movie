package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import com.moviesite.mysite.model.entity.Movie;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {
	private String title;
    private String titleEn;
    private String director;
    private String actors;
    private String genre;
    private Integer runningTime;
    private LocalDate releaseDate;
    private LocalDate endDate;
    private String rating;
    private String synopsis;
    private String posterUrl;
    private String backgroundUrl;
    private String trailerUrl;
    private Movie.MovieStatus status;
    
 // 기본 생성자
    public MovieRequest() {}
    
    // 전체 필드 생성자
    public MovieRequest(String title, String titleEn, String director, String actors, 
                       String genre, Integer runningTime, LocalDate releaseDate, 
                       LocalDate endDate, String rating, String synopsis, 
                       String posterUrl, String backgroundUrl, String trailerUrl, 
                       Movie.MovieStatus status) {
        this.title = title;
        this.titleEn = titleEn;
        this.director = director;
        this.actors = actors;
        this.genre = genre;
        this.runningTime = runningTime;
        this.releaseDate = releaseDate;
        this.endDate = endDate;
        this.rating = rating;
        this.synopsis = synopsis;
        this.posterUrl = posterUrl;
        this.backgroundUrl = backgroundUrl;
        this.trailerUrl = trailerUrl;
        this.status = status;
    }
    
    // Getter 메서드
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
    
    public Movie.MovieStatus getStatus() {
        return status;
    }
    
    // Setter 메서드
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
    
    public void setStatus(Movie.MovieStatus status) {
        this.status = status;
    }
}
