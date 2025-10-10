package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    
    @NotNull(message = "상영 일정 ID는 필수 입력 항목입니다")
    private Long scheduleId;
    
    @NotNull(message = "좌석 목록은 필수 입력 항목입니다")
    @NotEmpty(message = "최소 1개 이상의 좌석을 선택해야 합니다")
    private List<Long> seatIds;
    
    @NotNull(message = "티켓 수량은 필수 입력 항목입니다")
    @Min(value = 1, message = "티켓 수량은 최소 1개 이상이어야 합니다")
    private Integer numberOfTickets;
}