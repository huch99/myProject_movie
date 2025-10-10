package com.moviesite.mysite.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Schedule;
import com.moviesite.mysite.model.entity.Schedule.ScheduleStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

	// 특정 영화의 상영 일정 조회
	List<Schedule> findByMovieId(Long movieId);

	// 특정 상영관의 상영 일정 조회
	List<Schedule> findByScreenId(Long screenId);

	// 특정 영화의 특정 날짜 상영 일정 조회
	@Query("SELECT s FROM Schedule s WHERE s.movie.id = :movieId AND DATE(s.startTime) = :date ORDER BY s.startTime")
	List<Schedule> findByMovieIdAndDate(@Param("movieId") Long movieId, @Param("date") LocalDate date);

	// 특정 극장의 상영 일정 조회 (스크린이 속한 극장 기준)
	@Query("SELECT s FROM Schedule s JOIN s.screen scr WHERE scr.theater.id = :theaterId ORDER BY s.startTime")
	List<Schedule> findByTheaterId(@Param("theaterId") Long theaterId);

	// 특정 극장의 특정 날짜 상영 일정 조회
	@Query("SELECT s FROM Schedule s JOIN s.screen scr WHERE scr.theater.id = :theaterId AND DATE(s.startTime) = :date ORDER BY s.startTime")
	List<Schedule> findByTheaterIdAndDate(@Param("theaterId") Long theaterId, @Param("date") LocalDate date);

	// 특정 날짜의 모든 상영 일정 조회
	@Query("SELECT s FROM Schedule s WHERE DATE(s.startTime) = :date ORDER BY s.startTime")
	List<Schedule> findByDate(@Param("date") LocalDate date);

	// 예매 가능한 상영 일정 조회
	List<Schedule> findByStartTimeAfterAndStatus(LocalDateTime now, Schedule.ScheduleStatus status);

	// 특정 영화의 예매 가능한 상영 일정 조회
	List<Schedule> findByMovieIdAndStartTimeAfterAndStatus(Long movieId, LocalDateTime now,
			Schedule.ScheduleStatus status);

	// 특정 영화의 예매 가능 여부 확인
	boolean existsByMovieIdAndStartTimeAfterAndStatus(Long movieId, LocalDateTime now, String status);

	// 특정 시간 범위 내의 상영 일정 조회
	List<Schedule> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);

	// 매진된 상영 일정 조회
	@Query("SELECT s FROM Schedule s WHERE s.availableSeats = 0")
	List<Schedule> findSoldOutSchedules();

	// 특정 영화의 가장 빠른 상영 일정 조회
	@Query("SELECT s FROM Schedule s WHERE s.movie.id = :movieId AND s.startTime > CURRENT_TIMESTAMP ORDER BY s.startTime ASC")
	List<Schedule> findEarliestScheduleByMovieId(@Param("movieId") Long movieId, Pageable pageable);

	// 상영 중인 영화 목록 조회 (현재 시간 기준으로 상영 중인 스케줄이 있는 영화)
	@Query("SELECT DISTINCT s.movie FROM Schedule s WHERE s.startTime <= CURRENT_TIMESTAMP AND s.endTime >= CURRENT_TIMESTAMP")
	List<Schedule> findNowPlayingMovies();

	// 특정 날짜에 상영하는 영화 목록 조회
	@Query("SELECT DISTINCT s.movie FROM Schedule s WHERE DATE(s.startTime) = :date")
	List<Schedule> findMoviesByDate(@Param("date") LocalDate date);

	// 특정 날짜, 특정 극장에서 상영하는 영화 목록 조회
	@Query("SELECT DISTINCT s.movie FROM Schedule s JOIN s.screen scr WHERE scr.theater.id = :theaterId AND DATE(s.startTime) = :date")
	List<Schedule> findMoviesByTheaterAndDate(@Param("theaterId") Long theaterId, @Param("date") LocalDate date);

	// 특정 상영관의 향후 상영 일정 조회
	List<Schedule> findByScreenIdAndStartTimeAfterOrderByStartTime(Long screenId, LocalDateTime startTime);

	// 특정 상영관의 현재 상영 중인 영화 일정 조회
	List<Schedule> findByScreenIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(Long screenId, LocalDateTime now,
			LocalDateTime now2);

	List<Schedule> findByMovieIdAndStartTimeBetween(Long movieId, LocalDateTime startTime, LocalDateTime endTime);

	List<Schedule> findOverlappingSchedules(Long screenId, LocalDateTime startTime, LocalDateTime endTime);

	List<Schedule> findByMovieIdAndStatusAndStartTimeAfterOrderByStartTime(Long movieId, ScheduleStatus open,
			LocalDateTime now);

	List<Schedule> findByScreenIdAndStatusAndStartTimeAfterOrderByStartTime(Long screenId, ScheduleStatus open,
			LocalDateTime now);

	List<Schedule> findByScreenTheaterIdAndStartTimeBetweenAndStatusOrderByStartTime(Long theaterId,
			LocalDateTime startOfDay, LocalDateTime endOfDay, ScheduleStatus open);

	List<Schedule> findOverlappingSchedulesExcluding(Long screenId, LocalDateTime startTime, LocalDateTime endTime,
			Long excludeScheduleId);
}
