package com.moviesite.mysite.model.dto.response;

import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Screening;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningResponse {
	private Long id;
	private Long movieId;
	private Long screenId;
	private String movieTitle;
	private String theaterName;
	private String screenName;
	private LocalDateTime startTime;
	private LocalDateTime endTime;
	private Integer basePrice;

	public static ScreeningResponse fromEntity(Screening screening) {
	    ScreeningResponse response = new ScreeningResponse();
	    response.setId(screening.getId());
	    response.setMovieId(screening.getMovie().getId());
	    response.setScreenId(screening.getScreen().getId());
	    response.setMovieTitle(screening.getMovie().getTitle());
	    response.setTheaterName(screening.getScreen().getTheater().getName());
	    response.setScreenName(screening.getScreen().getName());
	    response.setStartTime(screening.getStartTime());
	    response.setEndTime(screening.getEndTime());
	    response.setBasePrice(screening.getBasePrice());
	    return response;
	}
	
	// Getter 메서드
	public Long getId() {
	    return id;
	}

	public Long getMovieId() {
	    return movieId;
	}

	public Long getScreenId() {
	    return screenId;
	}

	public String getMovieTitle() {
	    return movieTitle;
	}

	public String getTheaterName() {
	    return theaterName;
	}

	public String getScreenName() {
	    return screenName;
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

	// Setter 메서드
	public void setId(Long id) {
	    this.id = id;
	}

	public void setMovieId(Long movieId) {
	    this.movieId = movieId;
	}

	public void setScreenId(Long screenId) {
	    this.screenId = screenId;
	}

	public void setMovieTitle(String movieTitle) {
	    this.movieTitle = movieTitle;
	}

	public void setTheaterName(String theaterName) {
	    this.theaterName = theaterName;
	}

	public void setScreenName(String screenName) {
	    this.screenName = screenName;
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
}
