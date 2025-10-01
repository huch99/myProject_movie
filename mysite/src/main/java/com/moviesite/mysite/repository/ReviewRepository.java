package com.moviesite.mysite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
	List<Review> findByMovieId(Long movieId);

	List<Review> findByUserId(Long userId);

	Optional<Review> findByUserIdAndMovieId(Long userId, Long movieId);
}
