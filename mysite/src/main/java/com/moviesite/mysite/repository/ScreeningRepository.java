package com.moviesite.mysite.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Screening;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {
	List<Screening> findByMovieId(Long movieId);

	List<Screening> findByScreenTheaterId(Long theaterId);

	List<Screening> findByStartTimeBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

	List<Screening> findByMovieIdAndScreenTheaterIdAndStartTimeBetween(Long movieId, Long theaterId,
			LocalDateTime startOfDay, LocalDateTime endOfDay);

	// 특정 상영관의 특정 시간대의 상영 정보 조회 (중복 상영 방지 등)
	List<Screening> findByScreenIdAndStartTimeBeforeAndEndTimeAfter(Long screenId, LocalDateTime endTime,
			LocalDateTime startTime);
}
