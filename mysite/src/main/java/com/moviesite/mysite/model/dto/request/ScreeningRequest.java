package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreeningRequest {

    @NotNull(message = "영화 ID는 필수 입력값입니다")
    private Long movieId;

    @NotNull(message = "상영관 ID는 필수 입력값입니다")
    private Long screenId;

    @NotNull(message = "스케줄 ID는 필수 입력값입니다")
    private Long scheduleId;

    @NotNull(message = "상영 날짜는 필수 입력값입니다")
    @Future(message = "상영 날짜는 미래 날짜여야 합니다")
    private LocalDate screeningDate;

    @NotNull(message = "상영 시간은 필수 입력값입니다")
    private LocalTime screeningTime;

    @NotNull(message = "종료 시간은 필수 입력값입니다")
    private LocalTime endTime;

    private Boolean isFull = false;

    @NotNull(message = "사용 가능한 좌석 수는 필수 입력값입니다")
    @Min(value = 0, message = "사용 가능한 좌석 수는 0 이상이어야 합니다")
    private Integer availableSeats;

    private String status;
}