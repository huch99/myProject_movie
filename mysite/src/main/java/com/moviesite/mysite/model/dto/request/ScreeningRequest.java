package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningRequest {
	private Long movieId;
    private Long screenId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer basePrice;
    
 // Getter 메서드
    public Long getMovieId() {
        return movieId;
    }

    public Long getScreenId() {
        return screenId;
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
    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public void setScreenId(Long screenId) {
        this.screenId = screenId;
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
