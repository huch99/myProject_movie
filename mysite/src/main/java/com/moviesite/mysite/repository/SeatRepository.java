package com.moviesite.mysite.repository;

import com.moviesite.mysite.model.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    // 특정 상영관의 모든 좌석 조회
    List<Seat> findByScreenId(Long screenId);

    // 특정 상영관의 활성화된 좌석만 조회
    List<Seat> findByScreenIdAndIsActiveTrue(Long screenId);

    // 특정 상영관의 특정 타입 좌석 조회
    List<Seat> findByScreenIdAndSeatType(Long screenId, Seat.SeatType seatType);

    // 특정 행의 좌석 조회
    List<Seat> findByScreenIdAndRowNameOrderByColumnNumber(Long screenId, String rowName);

    // 특정 상영관의 모든 좌석 행 목록 (중복 제거)
    @Query("SELECT DISTINCT s.rowName FROM Seat s WHERE s.screen.id = :screenId ORDER BY s.rowName")
    List<String> findDistinctRowNamesByScreenId(@Param("screenId") Long screenId);

    // 특정 상영관의 특정 좌석 조회
    Seat findByScreenIdAndRowNameAndColumnNumber(Long screenId, String rowName, Integer columnNumber);

    // 좌석 존재 여부 확인
    boolean existsByScreenIdAndRowNameAndColumnNumber(Long screenId, String rowName, Integer columnNumber);

    // 좌석 ID 목록으로 좌석 조회
    List<Seat> findByIdIn(List<Long> seatIds);
}