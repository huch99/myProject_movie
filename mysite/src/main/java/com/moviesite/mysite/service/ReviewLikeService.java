package com.moviesite.mysite.service;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.ReviewLikeResponse;
import com.moviesite.mysite.model.dto.response.UserResponse;
import com.moviesite.mysite.model.entity.Review;
import com.moviesite.mysite.model.entity.ReviewLike;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.ReviewLikeRepository;
import com.moviesite.mysite.repository.ReviewRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewLikeService {

    private final ReviewLikeRepository reviewLikeRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // 리뷰 좋아요 토글
    @Transactional
    public Map<String, Object> toggleReviewLike(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));
        
        User currentUser = getCurrentUser();
        Optional<ReviewLike> existingLike = reviewLikeRepository.findByUserIdAndReviewId(currentUser.getId(), reviewId);
        
        Map<String, Object> result = new HashMap<>();
        
        if (existingLike.isPresent()) {
            // 좋아요 취소
            reviewLikeRepository.delete(existingLike.get());
            
            // 리뷰의 좋아요 수 감소
            review.setLikes(review.getLikes() - 1);
            reviewRepository.save(review);
            
            result.put("liked", false);
            result.put("likeCount", review.getLikes());
            result.put("message", "리뷰 좋아요가 취소되었습니다");
        } else {
            // 좋아요 추가
            ReviewLike reviewLike = ReviewLike.builder()
                    .user(currentUser)
                    .review(review)
                    .build();
            
            reviewLikeRepository.save(reviewLike);
            
            // 리뷰의 좋아요 수 증가
            review.setLikes(review.getLikes() + 1);
            reviewRepository.save(review);
            
            result.put("liked", true);
            result.put("likeCount", review.getLikes());
            result.put("message", "리뷰에 좋아요를 눌렀습니다");
        }
        
        return result;
    }

    // 특정 리뷰의 좋아요 수 조회
    public Long getReviewLikeCount(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found with id: " + reviewId);
        }
        
        return reviewLikeRepository.countByReviewId(reviewId);
    }

    // 특정 리뷰에 대한 사용자의 좋아요 여부 확인
    public boolean hasUserLikedReview(Long reviewId) {
        User currentUser = getCurrentUser();
        return reviewLikeRepository.existsByUserIdAndReviewId(currentUser.getId(), reviewId);
    }

    // 특정 사용자가 좋아요한 리뷰 목록 조회
    public Map<String, Object> getUserLikedReviews() {
        User currentUser = getCurrentUser();
        List<ReviewLike> userLikes = reviewLikeRepository.findByUser(currentUser);
        
        List<ReviewLikeResponse> likeResponses = userLikes.stream()
                .map(ReviewLikeResponse::fromEntity)
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("likes", likeResponses);
        result.put("count", likeResponses.size());
        
        return result;
    }

    // 특정 리뷰를 좋아요한 사용자 목록 조회 (관리자용)
    public Map<String, Object> getUsersWhoLikedReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found with id: " + reviewId);
        }
        
        List<ReviewLike> reviewLikes = reviewLikeRepository.findByReviewId(reviewId);
        
        List<UserResponse> userResponses = reviewLikes.stream()
                .map(like -> UserResponse.fromEntity(like.getUser()))
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("users", userResponses);
        result.put("count", userResponses.size());
        
        return result;
    }
    
    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}