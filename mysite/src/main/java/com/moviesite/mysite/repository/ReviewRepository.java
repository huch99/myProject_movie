package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Review;
import com.moviesite.mysite.model.entity.Review.ReviewStatus;
import com.moviesite.mysite.model.entity.User;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

	 // 특정 영화의 모든 리뷰 조회 (페이징 처리)
    Page<Review> findByMovieIdAndStatusOrderByCreatedAtDesc(Long movieId, Review.ReviewStatus status, Pageable pageable);
    
    // 특정 영화의 모든 활성 리뷰 조회
    List<Review> findByMovieIdAndStatus(Long movieId, Review.ReviewStatus status);
    
    // 특정 영화의 리뷰 수 조회
    Long countByMovieId(Long movieId);
    
    // 특정 영화의 평균 평점 조회
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movie.id = :movieId AND r.status = 'ACTIVE'")
    Double findAverageRatingByMovieId(@Param("movieId") Long movieId);
    
    // 특정 영화의 좋아요 순으로 정렬된 상위 리뷰 조회
    List<Review> findTop5ByMovieIdOrderByLikesDesc(Long movieId);
    
    // 특정 사용자가 작성한 모든 리뷰 조회
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // 특정 사용자가 특정 영화에 작성한 리뷰 조회
    List<Review> findByUserIdAndMovieId(Long userId, Long movieId);
    
    // 특정 사용자가 특정 영화에 리뷰를 작성했는지 확인
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
    
    // 최근 작성된 리뷰 조회
    List<Review> findTop10ByStatusOrderByCreatedAtDesc(Review.ReviewStatus status);
    
    // 평점 범위로 리뷰 검색
    @Query("SELECT r FROM Review r WHERE r.movie.id = :movieId AND r.rating BETWEEN :minRating AND :maxRating AND r.status = 'ACTIVE'")
    List<Review> findByMovieIdAndRatingBetween(@Param("movieId") Long movieId, 
                                              @Param("minRating") Double minRating, 
                                              @Param("maxRating") Double maxRating);
    
    // 스포일러가 포함된 리뷰만 조회
    List<Review> findByMovieIdAndSpoilerTrue(Long movieId);
    
    // 스포일러가 없는 리뷰만 조회
    List<Review> findByMovieIdAndSpoilerFalse(Long movieId);
    
    // 특정 키워드가 포함된 리뷰 검색
    @Query("SELECT r FROM Review r WHERE r.movie.id = :movieId AND r.content LIKE %:keyword% AND r.status = 'ACTIVE'")
    List<Review> findByMovieIdAndContentContaining(@Param("movieId") Long movieId, @Param("keyword") String keyword);

	Long countByMovieIdAndRatingBetween(Long movieId, BigDecimal minRating, BigDecimal maxRating);

	List<Review> findTop10ByStatusOrderByLikesDesc(ReviewStatus active);

	Page<Review> findByMovieIdAndSpoilerFalseAndStatusOrderByCreatedAtDesc(Long movieId, ReviewStatus active,
			Pageable pageable);

	Page<Review> findByUserAndStatusOrderByCreatedAtDesc(User user, ReviewStatus active, Pageable pageable);

	boolean existsByUserAndMovieAndStatusNot(User currentUser, Movie movie, ReviewStatus deleted);
}
