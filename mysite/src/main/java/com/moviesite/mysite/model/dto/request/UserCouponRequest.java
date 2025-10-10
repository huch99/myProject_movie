package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.Future;
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
public class UserCouponRequest {

    @NotNull(message = "사용자 ID는 필수 입력값입니다")
    private Long userId;

    @NotNull(message = "쿠폰 ID는 필수 입력값입니다")
    private Long couponId;

    @NotNull(message = "발급 일자는 필수 입력값입니다")
    private LocalDateTime issueDate;

    @NotNull(message = "만료 일자는 필수 입력값입니다")
    @Future(message = "만료 일자는 미래 날짜여야 합니다")
    private LocalDateTime expiryDate;
}