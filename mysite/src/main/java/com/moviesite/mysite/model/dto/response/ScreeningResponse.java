package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Screening;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScreeningResponse {

    private Long screeningId;
    private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private Long screenId;
    private String screenName;
    private String screenType;
    private Long theaterId;
    private String theaterName;
    private Long scheduleId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate screeningDate;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime screeningTime;

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime endTime;

    private String formattedScreeningTime;
    private String formattedEndTime;
    private String formattedDate;
    private Boolean isFull;
    private Integer availableSeats;
    private String status;
    private boolean bookable;
    private boolean canceled;
    private boolean completed;

    // Entity -> DTO 변환 메서드
    public static ScreeningResponse fromEntity(Screening screening) {
        if (screening == null) {
            return null;
        }

        return ScreeningResponse.builder()
                .screeningId(screening.getId())
                .movieId(screening.getMovie().getId())
                .movieTitle(screening.getMovie().getTitle())
                .moviePosterUrl(screening.getMovie().getPosterUrl())
                .screenId(screening.getScreen().getId())
                .screenName(screening.getScreen().getName())
                .screenType(screening.getScreen().getType())
                .theaterId(screening.getScreen().getTheater().getId())
                .theaterName(screening.getScreen().getTheater().getName())
                .scheduleId(screening.getSchedule().getId())
                .screeningDate(screening.getScreeningDate())
                .screeningTime(screening.getScreeningTime())
                .endTime(screening.getEndTime())
                .formattedScreeningTime(screening.getScreeningTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .formattedEndTime(screening.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .formattedDate(screening.getScreeningDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                .isFull(screening.getIsFull())
                .availableSeats(screening.getAvailableSeats())
                .status(screening.getStatus().name())
                .bookable(screening.isBookable())
                .canceled(screening.isCanceled())
                .completed(screening.isCompleted())
                .build();
    }
}