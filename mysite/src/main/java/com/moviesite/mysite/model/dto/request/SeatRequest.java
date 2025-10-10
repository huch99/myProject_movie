package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatRequest {

    @NotNull(message = "상영관 ID는 필수 입력값입니다")
    private Long screenId;

    @NotBlank(message = "좌석 행 이름은 필수 입력값입니다")
    private String rowName;

    @NotNull(message = "좌석 열 번호는 필수 입력값입니다")
    @Positive(message = "좌석 열 번호는 양수여야 합니다")
    private Integer columnNumber;

    private String seatType = "STANDARD";  // STANDARD, PREMIUM, HANDICAPPED, COUPLE

    private Boolean isActive = true;
}