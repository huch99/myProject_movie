package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewLikeRequest {
    
    @NotNull(message = "리뷰 ID는 필수 입력값입니다")
    private Long reviewId;
}