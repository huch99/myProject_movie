package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.ReviewRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.ReviewResponse;
import com.moviesite.mysite.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // 특정 영화의 리뷰 목록 조회
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviewsByMovieId(
            @PathVariable Long movieId,
            @RequestParam(required = false) Boolean spoilerFilter,
            Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByMovieId(movieId, spoilerFilter, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    // 특정 사용자의 리뷰 목록 조회
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviewsByUserId(
            @PathVariable Long userId,
            Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getReviewsByUserId(userId, pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    // 내가 작성한 리뷰 목록 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getMyReviews(Pageable pageable) {
        Page<ReviewResponse> reviews = reviewService.getMyReviews(pageable);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    // 특정 리뷰 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(@PathVariable Long id) {
        ReviewResponse review = reviewService.getReviewById(id);
        return ResponseEntity.ok(ApiResponse.success(review));
    }

    // 리뷰 작성
    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse createdReview = reviewService.createReview(request);
        return new ResponseEntity<>(ApiResponse.success("리뷰가 성공적으로 등록되었습니다.", createdReview), HttpStatus.CREATED);
    }

    // 리뷰 수정
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse updatedReview = reviewService.updateReview(id, request);
        return ResponseEntity.ok(ApiResponse.success("리뷰가 성공적으로 수정되었습니다.", updatedReview));
    }

    // 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("리뷰가 성공적으로 삭제되었습니다.", null));
    }

    // 리뷰 숨김 처리 (관리자용)
    @PatchMapping("/{id}/hide")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> hideReview(@PathVariable Long id) {
        ReviewResponse hiddenReview = reviewService.hideReview(id);
        return ResponseEntity.ok(ApiResponse.success("리뷰가 성공적으로 숨김 처리되었습니다.", hiddenReview));
    }
}