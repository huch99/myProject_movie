package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Schedule;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScheduleResponse {
    
    private Long scheduleId;
    private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private Long screenId;
    private String screenName;
    private Long theaterId;
    private String theaterName;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
    
    private String formattedStartTime;
    private String formattedEndTime;
    private String formattedDate;
    private Integer price;
    private Integer availableSeats;
    private String status;
    private Integer durationMinutes;
    private boolean soldOut;
    private boolean bookable;
    
    // Entity -> DTO 변환 메서드
    public static ScheduleResponse fromEntity(Schedule schedule) {
        if (schedule == null) {
            return null;
        }
        
        return ScheduleResponse.builder()
                .scheduleId(schedule.getId())
                .movieId(schedule.getMovie().getId())
                .movieTitle(schedule.getMovie().getTitle())
                .moviePosterUrl(schedule.getMovie().getPosterUrl())
                .screenId(schedule.getScreen().getId())
                .screenName(schedule.getScreen().getName())
                .theaterId(schedule.getScreen().getTheater().getId())
                .theaterName(schedule.getScreen().getTheater().getName())
                .startTime(schedule.getStartTime())
                .endTime(schedule.getEndTime())
                .formattedStartTime(schedule.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .formattedEndTime(schedule.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .formattedDate(schedule.getStartTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                .price(schedule.getPrice())
                .availableSeats(schedule.getAvailableSeats())
                .status(schedule.getStatus().name())
                .durationMinutes(schedule.getDurationMinutes())
                .soldOut(schedule.isSoldOut())
                .bookable(schedule.isBookable())
                .build();
    }
}