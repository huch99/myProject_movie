package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Seat;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

	// 특정 상영관의 모든 좌석 조회
    List<Seat> findByScreenId(Long screenId);
    
    // 특정 상영관의 모든 좌석 조회 (페이징 처리)
    Page<Seat> findByScreenId(Long screenId, Pageable pageable);
    
    // 특정 상영관의 특정 타입 좌석 조회
    List<Seat> findByScreenIdAndSeatType(Long screenId, Seat.SeatType seatType);
    
    // 특정 상영관의 특정 행의 좌석 조회
    List<Seat> findByScreenIdAndRowNameOrderByColumnNumber(Long screenId, String rowName);
    
    // 특정 상영관의 특정 열의 좌석 조회
    List<Seat> findByScreenIdAndColumnNumberOrderByRowName(Long screenId, Integer columnNumber);
    
    // 특정 상영관의 활성화된 좌석 수 조회
    @Query("SELECT COUNT(s) FROM Seat s WHERE s.screen.id = :screenId AND s.isActive = true")
    Long countActiveByScreenId(@Param("screenId") Long screenId);
    
    // 특정 상영관의 비활성화된 좌석 조회
    List<Seat> findByScreenIdAndIsActiveFalse(Long screenId);
    
    // 특정 좌석 위치로 좌석 조회
    Seat findByScreenIdAndRowNameAndColumnNumber(Long screenId, String rowName, Integer columnNumber);
    
    // 특정 좌석 라벨로 좌석 조회
    @Query("SELECT s FROM Seat s WHERE s.screen.id = :screenId AND CONCAT(s.rowName, s.columnNumber) = :seatLabel")
    Seat findBySeatLabel(@Param("screenId") Long screenId, @Param("seatLabel") String seatLabel);
    
    // 특정 상영관의 장애인석 조회
    List<Seat> findByScreenIdAndSeatType(Long screenId, String seatType);
    
    // 특정 상영관의 커플석 조회
    @Query("SELECT s FROM Seat s WHERE s.screen.id = :screenId AND s.seatType = 'COUPLE'")
    List<Seat> findCoupleSeats(@Param("screenId") Long screenId);
    
    // 특정 상영관의 프리미엄석 조회
    @Query("SELECT s FROM Seat s WHERE s.screen.id = :screenId AND s.seatType = 'PREMIUM'")
    List<Seat> findPremiumSeats(@Param("screenId") Long screenId);
    
    // 특정 상영관의 좌석 존재 여부 확인
    boolean existsByScreenIdAndRowNameAndColumnNumber(Long screenId, String rowName, Integer columnNumber);

    // 예약 가능한 좌석 목록 조회 
	List<Seat> findByScreenIdAndIsActiveTrue(Long screenId);

}
