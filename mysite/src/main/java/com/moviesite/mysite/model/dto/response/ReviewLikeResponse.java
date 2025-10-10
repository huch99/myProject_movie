package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.ReviewLike;
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
public class ReviewLikeResponse {
    
    private Long id;
    private Long userId;
    private String userName;
    private Long reviewId;
    private Long movieId;
    private String movieTitle;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    private String formattedCreatedAt;
    
    // Entity -> DTO 변환 메서드
    public static ReviewLikeResponse fromEntity(ReviewLike reviewLike) {
        if (reviewLike == null) {
            return null;
        }
        
        return ReviewLikeResponse.builder()
                .id(reviewLike.getId())
                .userId(reviewLike.getUser().getId())
                .userName(reviewLike.getUser().getName())
                .reviewId(reviewLike.getReview().getId())
                .movieId(reviewLike.getReview().getMovie().getId())
                .movieTitle(reviewLike.getReview().getMovie().getTitle())
                .createdAt(reviewLike.getCreatedAt())
                .formattedCreatedAt(reviewLike.getCreatedAt() != null ?
                        reviewLike.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .build();
    }
}