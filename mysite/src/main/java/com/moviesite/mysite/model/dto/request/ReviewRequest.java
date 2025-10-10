package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    
    @NotNull(message = "영화 ID는 필수 입력값입니다")
    private Long movieId;
    
    @NotNull(message = "평점은 필수 입력값입니다")
    @DecimalMin(value = "0.5", message = "평점은 0.5점 이상이어야 합니다")
    @DecimalMax(value = "5.0", message = "평점은 5.0점 이하여야 합니다")
    private BigDecimal rating;
    
    @Size(max = 2000, message = "리뷰 내용은 2000자를 초과할 수 없습니다")
    private String content;
    
    private Boolean spoiler = false;
}