package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationSeatRequest {
    
    @NotNull(message = "예매 ID는 필수 입력값입니다")
    private Long reservationId;
    
    @NotNull(message = "좌석 ID는 필수 입력값입니다")
    private Long seatId;
    
    @NotNull(message = "좌석 가격은 필수 입력값입니다")
    @Positive(message = "좌석 가격은 0보다 커야 합니다")
    private BigDecimal price;
}