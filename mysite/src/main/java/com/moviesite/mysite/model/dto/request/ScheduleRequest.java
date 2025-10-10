package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleRequest {
    
    @NotNull(message = "영화 ID는 필수 입력값입니다")
    private Long movieId;
    
    @NotNull(message = "상영관 ID는 필수 입력값입니다")
    private Long screenId;
    
    @NotNull(message = "상영 시작 시간은 필수 입력값입니다")
    @Future(message = "상영 시작 시간은 미래 시간이어야 합니다")
    private LocalDateTime startTime;
    
    @NotNull(message = "상영 종료 시간은 필수 입력값입니다")
    @Future(message = "상영 종료 시간은 미래 시간이어야 합니다")
    private LocalDateTime endTime;
    
    @NotNull(message = "가격은 필수 입력값입니다")
    @Min(value = 0, message = "가격은 0 이상이어야 합니다")
    private Integer price;
    
    private String status;
}