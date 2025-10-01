package com.moviesite.mysite.model.dto.response;

import com.moviesite.mysite.model.entity.Movie;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
	private Long id;
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
	public MovieResponse() {
	}

	// 전체 필드 생성자
	public MovieResponse(Long id, String title, String titleEn, String director, String actors, String genre,
			Integer runningTime, LocalDate releaseDate, LocalDate endDate, String rating, String synopsis,
			String posterUrl, String backgroundUrl, String trailerUrl, Movie.MovieStatus status) {
		this.id = id;
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

	// Builder 클래스 구현
	public static Builder builder() {
		return new Builder();
	}

	// Builder 내부 클래스
	public static class Builder {
		private Long id;
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

		// Builder 메서드들
		public Builder id(Long id) {
			this.id = id;
			return this;
		}

		public Builder title(String title) {
			this.title = title;
			return this;
		}

		public Builder titleEn(String titleEn) {
			this.titleEn = titleEn;
			return this;
		}

		public Builder director(String director) {
			this.director = director;
			return this;
		}

		public Builder actors(String actors) {
			this.actors = actors;
			return this;
		}

		public Builder genre(String genre) {
			this.genre = genre;
			return this;
		}

		public Builder runningTime(Integer runningTime) {
			this.runningTime = runningTime;
			return this;
		}

		public Builder releaseDate(LocalDate releaseDate) {
			this.releaseDate = releaseDate;
			return this;
		}

		public Builder endDate(LocalDate endDate) {
			this.endDate = endDate;
			return this;
		}

		public Builder rating(String rating) {
			this.rating = rating;
			return this;
		}

		public Builder synopsis(String synopsis) {
			this.synopsis = synopsis;
			return this;
		}

		public Builder posterUrl(String posterUrl) {
			this.posterUrl = posterUrl;
			return this;
		}

		public Builder backgroundUrl(String backgroundUrl) {
			this.backgroundUrl = backgroundUrl;
			return this;
		}

		public Builder trailerUrl(String trailerUrl) {
			this.trailerUrl = trailerUrl;
			return this;
		}

		public Builder status(Movie.MovieStatus status) {
			this.status = status;
			return this;
		}

		// build 메서드
		public MovieResponse build() {
			return new MovieResponse(id, title, titleEn, director, actors, genre, runningTime, releaseDate, endDate,
					rating, synopsis, posterUrl, backgroundUrl, trailerUrl, status);
		}

		// Getter 메서드들
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

		public Movie.MovieStatus getStatus() {
			return status;
		}
	}
}
