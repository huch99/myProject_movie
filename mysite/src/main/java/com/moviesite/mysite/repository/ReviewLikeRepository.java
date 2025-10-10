package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.ReviewLike;
import com.moviesite.mysite.model.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

	// 특정 사용자의 특정 리뷰 좋아요 조회
    Optional<ReviewLike> findByUserIdAndReviewId(Long userId, Long reviewId);
    
    // 특정 사용자의 특정 리뷰 좋아요 여부 확인
    boolean existsByUserIdAndReviewId(Long userId, Long reviewId);
    
    // 특정 사용자의 모든 좋아요 조회
    List<ReviewLike> findByUserId(Long userId);
    
    // 특정 리뷰의 모든 좋아요 조회
    List<ReviewLike> findByReviewId(Long reviewId);
    
    // 특정 리뷰의 좋아요 수 조회
    Long countByReviewId(Long reviewId);
    
    // 특정 사용자가 좋아요한 리뷰 ID 목록 조회
    @Query("SELECT rl.review.id FROM ReviewLike rl WHERE rl.user.id = :userId")
    List<Long> findReviewIdsByUserId(@Param("userId") Long userId);
    
    // 특정 사용자가 좋아요한 여러 리뷰 조회
    List<ReviewLike> findByUserIdAndReviewIdIn(Long userId, List<Long> reviewIds);
    
    // 특정 리뷰의 좋아요 삭제
    void deleteByReviewId(Long reviewId);
    
    // 특정 사용자의 특정 리뷰 좋아요 삭제
    void deleteByUserIdAndReviewId(Long userId, Long reviewId);

	List<ReviewLike> findByUser(User currentUser);
}
