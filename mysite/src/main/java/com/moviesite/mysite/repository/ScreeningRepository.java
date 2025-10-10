package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Screening;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {

	// 특정 영화의 상영 정보 조회
    List<Screening> findByMovieId(Long movieId);
    
    // 특정 상영관의 상영 정보 조회
    List<Screening> findByScreenId(Long screenId);
    
    // 특정 날짜의 상영 정보 조회
    List<Screening> findByScreeningDate(LocalDate date);
    
    // 특정 영화, 특정 날짜의 상영 정보 조회
    List<Screening> findByMovieIdAndScreeningDate(Long movieId, LocalDate date);
    
    // 특정 극장의 상영 정보 조회
    @Query("SELECT s FROM Screening s WHERE s.screen.theater.id = :theaterId")
    List<Screening> findByScreenTheaterId(@Param("theaterId") Long theaterId);
    
    // 특정 극장, 특정 날짜의 상영 정보 조회
    @Query("SELECT s FROM Screening s WHERE s.screen.theater.id = :theaterId AND s.screeningDate = :date")
    List<Screening> findByScreenTheaterIdAndScreeningDate(
            @Param("theaterId") Long theaterId, @Param("date") LocalDate date);
    
    // 특정 극장, 특정 영화의 상영 정보 조회
    @Query("SELECT s FROM Screening s WHERE s.screen.theater.id = :theaterId AND s.movie.id = :movieId")
    List<Screening> findByScreenTheaterIdAndMovieId(
            @Param("theaterId") Long theaterId, @Param("movieId") Long movieId);
    
    // 특정 날짜 범위의 상영 정보 조회
    List<Screening> findByScreeningDateBetween(LocalDate startDate, LocalDate endDate);
    
    // 특정 날짜 이후의 상영 정보 조회 (상태별, 날짜순 정렬)
    List<Screening> findByScreeningDateGreaterThanEqualAndStatusOrderByScreeningDate(
            LocalDate date, Screening.ScreeningStatus status);
    
    // 특정 시간 범위 내의 상영 정보 조회
    @Query("SELECT s FROM Screening s WHERE s.screeningDate = :date AND " +
           "s.screeningTime BETWEEN :startTime AND :endTime")
    List<Screening> findByScreeningDateAndScreeningTimeBetween(
            @Param("date") LocalDate date, 
            @Param("startTime") LocalTime startTime, 
            @Param("endTime") LocalTime endTime);
    
    // 특정 상영관의 특정 시간대 상영 정보 조회 (시간 중복 체크용)
    @Query("SELECT s FROM Screening s WHERE s.screen.id = :screenId AND s.screeningDate = :date AND " +
           "((s.screeningTime <= :endTime AND s.endTime >= :startTime) OR " +
           "(s.screeningTime >= :startTime AND s.screeningTime <= :endTime))")
    List<Screening> findOverlappingScreenings(
            @Param("screenId") Long screenId, 
            @Param("date") LocalDate date, 
            @Param("startTime") LocalTime startTime, 
            @Param("endTime") LocalTime endTime);
    
    // 특정 상영관의 현재 상영 중인 영화 조회
    @Query("SELECT s FROM Screening s WHERE s.screen.id = :screenId AND " +
           "s.screeningDate = CURRENT_DATE AND " +
           "s.screeningTime <= CURRENT_TIME AND s.endTime >= CURRENT_TIME")
    List<Screening> findCurrentScreeningsByScreenId(@Param("screenId") Long screenId);
    
    // 특정 상영의 예약된 좌석 목록 조회
    @Query("SELECT CONCAT(st.rowName, st.columnNumber) FROM ReservationSeat rs " +
           "JOIN rs.seat st JOIN rs.reservation r JOIN r.schedule sc " +
           "WHERE sc.id = :scheduleId")
    List<String> findReservedSeatsByScreeningId(@Param("scheduleId") Long scheduleId);
    
    // 특정 좌석이 예약되었는지 확인
    @Query("SELECT COUNT(rs) > 0 FROM ReservationSeat rs " +
           "JOIN rs.seat st JOIN rs.reservation r JOIN r.schedule sc " +
           "WHERE sc.id = :scheduleId AND st.id = :seatId")
    boolean isSeatReserved(@Param("scheduleId") Long scheduleId, @Param("seatId") Long seatId);
    
    // 특정 날짜에 상영하는 영화 목록 조회
    @Query("SELECT DISTINCT s.movie FROM Screening s WHERE s.screeningDate = :date")
    List<Movie> findMoviesByScreeningDate(@Param("date") LocalDate date);
    
    // 특정 날짜, 특정 극장에서 상영하는 영화 목록 조회
    @Query("SELECT DISTINCT s.movie FROM Screening s WHERE s.screeningDate = :date AND s.screen.theater.id = :theaterId")
    List<Movie> findMoviesByScreeningDateAndTheaterId(
            @Param("date") LocalDate date, @Param("theaterId") Long theaterId);
    
    // 특정 상영관의 향후 상영 일정 조회
    List<Screening> findByScreenIdAndStartTimeAfterOrderByStartTime(Long screenId, LocalDateTime startTime);
    
    // 특정 상영관의 현재 상영 중인 영화 일정 조회
    @Query("SELECT s FROM Screening s WHERE s.screen.id = :screenId AND " +
           ":now BETWEEN s.startTime AND s.endTime")
    List<Screening> findByScreenIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            @Param("screenId") Long screenId, 
            @Param("now") LocalDateTime now);
}
