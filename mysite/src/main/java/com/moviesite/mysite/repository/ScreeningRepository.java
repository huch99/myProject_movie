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

    // 특정 영화의 상영 정보 조회 (현재 날짜 이후)
    List<Screening> findByMovieIdAndStatusAndScreeningDateAfterOrderByScreeningDateAscScreeningTimeAsc(
            Long movieId, Screening.ScreeningStatus status, LocalDate currentDate);

    // 특정 상영관의 상영 정보 조회 (현재 날짜 이후)
    List<Screening> findByScreenIdAndStatusAndScreeningDateAfterOrderByScreeningDateAscScreeningTimeAsc(
            Long screenId, Screening.ScreeningStatus status, LocalDate currentDate);

    // 특정 극장의 특정 날짜 상영 정보 조회
    List<Screening> findByScreenTheaterIdAndStatusAndScreeningDateOrderByScreeningTimeAsc(
            Long theaterId, Screening.ScreeningStatus status, LocalDate screeningDate);

    // 특정 스케줄의 상영 정보 조회
    List<Screening> findByScheduleIdAndStatusOrderByScreeningDateAscScreeningTimeAsc(
            Long scheduleId, Screening.ScreeningStatus status);

    // 중복 상영 시간 확인 (같은 상영관, 같은 날짜, 시간 겹침)
    @Query("SELECT s FROM Screening s WHERE s.screen.id = :screenId " +
            "AND s.screeningDate = :date " +
            "AND ((s.screeningTime <= :endTime AND s.endTime >= :startTime) " +
            "OR (s.screeningTime >= :startTime AND s.screeningTime <= :endTime))")
    List<Screening> findOverlappingScreenings(
            @Param("screenId") Long screenId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // 중복 상영 시간 확인 (특정 상영 제외)
    @Query("SELECT s FROM Screening s WHERE s.screen.id = :screenId " +
            "AND s.screeningDate = :date " +
            "AND ((s.screeningTime <= :endTime AND s.endTime >= :startTime) " +
            "OR (s.screeningTime >= :startTime AND s.screeningTime <= :endTime)) " +
            "AND s.id != :excludeId")
    List<Screening> findOverlappingScreeningsExcluding(
            @Param("screenId") Long screenId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId);

    // 특정 극장의 특정 날짜 범위 내 상영 정보 조회
    List<Screening> findByScreenTheaterIdAndStatusAndScreeningDateBetweenOrderByScreeningDateAscScreeningTimeAsc(
            Long theaterId, Screening.ScreeningStatus status, LocalDate startDate, LocalDate endDate);

    // 특정 영화의 특정 날짜 상영 정보 조회
    List<Screening> findByMovieIdAndStatusAndScreeningDateOrderByScreeningTimeAsc(
            Long movieId, Screening.ScreeningStatus status, LocalDate screeningDate);

    // 특정 상영관의 특정 날짜 상영 정보 조회
    List<Screening> findByScreenIdAndStatusAndScreeningDateOrderByScreeningTimeAsc(
            Long screenId, Screening.ScreeningStatus status, LocalDate screeningDate);

    // 매진된 상영 정보 조회
    List<Screening> findByIsFullTrueAndStatusOrderByScreeningDateAscScreeningTimeAsc(
            Screening.ScreeningStatus status);

    // 좌석 가용 수 업데이트를 위한 특정 상영 정보 조회
    @Query("SELECT s FROM Screening s WHERE s.id = :id")
    Screening findScreeningForUpdate(@Param("id") Long id);
}
