package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.ReviewRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.ReviewResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Review;
import com.moviesite.mysite.model.entity.Review.ReviewStatus;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.ReviewLikeRepository;
import com.moviesite.mysite.repository.ReviewRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ReviewLikeRepository reviewLikeRepository;

    // 특정 영화의 리뷰 목록 조회
    public Page<ReviewResponse> getReviewsByMovieId(Long movieId, Boolean spoilerFilter, Pageable pageable) {
        Page<Review> reviews;
        
        if (spoilerFilter != null && spoilerFilter) {
            reviews = reviewRepository.findByMovieIdAndSpoilerFalseAndStatusOrderByCreatedAtDesc(
                    movieId, ReviewStatus.ACTIVE, pageable);
        } else {
            reviews = reviewRepository.findByMovieIdAndStatusOrderByCreatedAtDesc(
                    movieId, ReviewStatus.ACTIVE, pageable);
        }
        
        User currentUser = getCurrentUserOrNull();
        return reviews.map(review -> {
            ReviewResponse response = ReviewResponse.fromEntity(review);
            if (currentUser != null) {
                boolean userLiked = reviewLikeRepository.existsByUserIdAndReviewId(currentUser.getId(), review.getId());
                response.withCurrentUserLikeStatus(userLiked);
            }
            return response;
        });
    }
    
    // 특정 사용자의 리뷰 목록 조회
    public Page<ReviewResponse> getReviewsByUserId(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Page<Review> reviews = reviewRepository.findByUserAndStatusOrderByCreatedAtDesc(
                user, ReviewStatus.ACTIVE, pageable);
        
        User currentUser = getCurrentUserOrNull();
        return reviews.map(review -> {
            ReviewResponse response = ReviewResponse.fromEntity(review);
            if (currentUser != null) {
                boolean userLiked = reviewLikeRepository.existsByUserIdAndReviewId(currentUser.getId(), review.getId());
                response.withCurrentUserLikeStatus(userLiked);
            }
            return response;
        });
    }
    
    // 내가 작성한 리뷰 목록 조회
    public Page<ReviewResponse> getMyReviews(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Review> reviews = reviewRepository.findByUserAndStatusOrderByCreatedAtDesc(
                currentUser, ReviewStatus.ACTIVE, pageable);
        
        return reviews.map(review -> {
            ReviewResponse response = ReviewResponse.fromEntity(review);
            boolean userLiked = reviewLikeRepository.existsByUserIdAndReviewId(currentUser.getId(), review.getId());
            response.withCurrentUserLikeStatus(userLiked);
            return response;
        });
    }
    
    // 특정 리뷰 상세 조회
    public ReviewResponse getReviewById(Long id) {
        Review review = findReviewById(id);
        
        // 삭제된 리뷰인 경우
        if (review.getStatus() == ReviewStatus.DELETED) {
            throw new ResourceNotFoundException("Review not found with id: " + id);
        }
        
        ReviewResponse response = ReviewResponse.fromEntity(review);
        
        // 현재 로그인한 사용자의 좋아요 여부 확인
        User currentUser = getCurrentUserOrNull();
        if (currentUser != null) {
            boolean userLiked = reviewLikeRepository.existsByUserIdAndReviewId(currentUser.getId(), review.getId());
            response.withCurrentUserLikeStatus(userLiked);
        }
        
        return response;
    }
    
    // 리뷰 작성
    @Transactional
    public ReviewResponse createReview(ReviewRequest request) {
        User currentUser = getCurrentUser();
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));
        
        // 이미 해당 영화에 리뷰를 작성했는지 확인
        if (reviewRepository.existsByUserAndMovieAndStatusNot(currentUser, movie, ReviewStatus.DELETED)) {
            throw new BadRequestException("이미 해당 영화에 리뷰를 작성하셨습니다");
        }
        
        Review review = Review.builder()
                .user(currentUser)
                .movie(movie)
                .rating(request.getRating())
                .content(request.getContent())
                .spoiler(request.getSpoiler())
                .likes(0)
                .status(ReviewStatus.ACTIVE)
                .build();
        
        Review savedReview = reviewRepository.save(review);
        return ReviewResponse.fromEntity(savedReview);
    }
    
    // 리뷰 수정
    @Transactional
    public ReviewResponse updateReview(Long id, ReviewRequest request) {
        Review review = findReviewById(id);
        validateReviewOwnership(review);
        
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setSpoiler(request.getSpoiler());
        review.setUpdatedAt(LocalDateTime.now());
        
        Review updatedReview = reviewRepository.save(review);
        return ReviewResponse.fromEntity(updatedReview);
    }
    
    // 리뷰 삭제
    @Transactional
    public void deleteReview(Long id) {
        Review review = findReviewById(id);
        validateReviewOwnership(review);
        
        review.setStatus(ReviewStatus.DELETED);
        review.setUpdatedAt(LocalDateTime.now());
        reviewRepository.save(review);
    }
    
    // 리뷰 숨김 처리 (관리자용)
    @Transactional
    public ReviewResponse hideReview(Long id) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        Review review = findReviewById(id);
        review.setStatus(ReviewStatus.HIDDEN);
        review.setUpdatedAt(LocalDateTime.now());
        
        Review updatedReview = reviewRepository.save(review);
        return ReviewResponse.fromEntity(updatedReview);
    }
    
    // 리뷰 엔티티 조회 (내부 메서드)
    private Review findReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
    }
    
    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    // 현재 로그인한 사용자 조회 (없을 경우 null 반환)
    private User getCurrentUserOrNull() {
        try {
            return getCurrentUser();
        } catch (Exception e) {
            return null;
        }
    }
    
    // 리뷰 소유권 확인
    private void validateReviewOwnership(Review review) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !review.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("해당 리뷰에 접근할 권한이 없습니다");
        }
    }
}