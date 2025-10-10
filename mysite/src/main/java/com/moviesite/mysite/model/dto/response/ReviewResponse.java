package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewResponse {
    
    private Long reviewId;
    private Long userId;
    private String userName;
    private String userProfileUrl;
    private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private BigDecimal rating;
    private String content;
    private Boolean spoiler;
    private Integer likes;
    private Boolean userLiked;  // 현재 로그인한 사용자가 좋아요 눌렀는지 여부
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    private String formattedCreatedAt;
    private boolean active;
    private boolean hidden;
    
    // Entity -> DTO 변환 메서드
    public static ReviewResponse fromEntity(Review review) {
        if (review == null) {
            return null;
        }
        
        return ReviewResponse.builder()
                .reviewId(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .userProfileUrl(review.getUser().getProfileImageUrl())
                .movieId(review.getMovie().getId())
                .movieTitle(review.getMovie().getTitle())
                .moviePosterUrl(review.getMovie().getPosterUrl())
                .rating(review.getRating())
                .content(review.getContent())
                .spoiler(review.getSpoiler())
                .likes(review.getLikes())
                .status(review.getStatus().name())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .formattedCreatedAt(review.getCreatedAt() != null ?
                        review.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .active(review.isActive())
                .hidden(review.isHidden())
                .build();
    }
    
    // 현재 사용자의 좋아요 상태 설정
    public ReviewResponse withCurrentUserLikeStatus(Boolean liked) {
        this.userLiked = liked;
        return this;
    }
}