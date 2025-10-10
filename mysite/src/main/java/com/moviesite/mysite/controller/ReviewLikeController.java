package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.service.ReviewLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/review-likes")
@RequiredArgsConstructor
public class ReviewLikeController {

    private final ReviewLikeService reviewLikeService;

    // 리뷰 좋아요 토글
    @PostMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleReviewLike(@PathVariable Long reviewId) {
        Map<String, Object> result = reviewLikeService.toggleReviewLike(reviewId);
        return ResponseEntity.ok(ApiResponse.success(result.get("message").toString(), result));
    }

    // 특정 리뷰의 좋아요 수 조회
    @GetMapping("/count/{reviewId}")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getReviewLikeCount(@PathVariable Long reviewId) {
        Long likeCount = reviewLikeService.getReviewLikeCount(reviewId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("likeCount", likeCount)));
    }

    // 특정 리뷰에 대한 사용자의 좋아요 여부 확인
    @GetMapping("/check/{reviewId}")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkReviewLike(@PathVariable Long reviewId) {
        boolean liked = reviewLikeService.hasUserLikedReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("liked", liked)));
    }

    // 특정 사용자가 좋아요한 리뷰 목록 조회
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserLikedReviews() {
        Map<String, Object> likedReviews = reviewLikeService.getUserLikedReviews();
        return ResponseEntity.ok(ApiResponse.success(likedReviews));
    }

    // 특정 리뷰를 좋아요한 사용자 목록 조회 (관리자용)
    @GetMapping("/users/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUsersWhoLikedReview(@PathVariable Long reviewId) {
        Map<String, Object> users = reviewLikeService.getUsersWhoLikedReview(reviewId);
        return ResponseEntity.ok(ApiResponse.success(users));
    }
}