package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.ReservationSeat;
import com.moviesite.mysite.model.entity.Schedule;
import com.moviesite.mysite.model.entity.Seat;

import java.util.List;

@Repository
public interface ReservationSeatRepository extends JpaRepository<ReservationSeat, Long> {

	 // 특정 예매의 모든 좌석 조회
    List<ReservationSeat> findByReservationId(Long reservationId);
    
    // 특정 좌석의 예매 내역 조회
    List<ReservationSeat> findBySeatId(Long seatId);
    
    // 특정 예매의 좌석 수 조회
    Long countByReservationId(Long reservationId);
    
    // 특정 상영 일정의 예약된 좌석 ID 목록 조회
    @Query("SELECT rs.seat.id FROM ReservationSeat rs JOIN rs.reservation r WHERE r.schedule.id = :scheduleId")
    List<Long> findSeatIdsByScheduleId(@Param("scheduleId") Long scheduleId);
    
    // 특정 상영 일정의 예약된 좌석 라벨 목록 조회
    @Query("SELECT CONCAT(s.rowName, s.columnNumber) FROM ReservationSeat rs JOIN rs.seat s JOIN rs.reservation r WHERE r.schedule.id = :scheduleId")
    List<String> findSeatLabelsByScheduleId(@Param("scheduleId") Long scheduleId);
    
    // 특정 상영 일정의 상영관 ID 조회
    @Query("SELECT DISTINCT s.screen.id FROM ReservationSeat rs JOIN rs.seat s JOIN rs.reservation r WHERE r.schedule.id = :scheduleId")
    Long findScreenIdByScheduleId(@Param("scheduleId") Long scheduleId);
    
    // 특정 좌석이 특정 상영 일정에 예약되었는지 확인
    boolean existsByReservationScheduleIdAndSeatId(Long scheduleId, Long seatId);
    
    // 특정 예매의 모든 좌석 삭제 (예매 취소 시)
    void deleteByReservationId(Long reservationId);
    
    // 특정 사용자의 예약 좌석 내역 조회
    @Query("SELECT rs FROM ReservationSeat rs JOIN rs.reservation r WHERE r.user.id = :userId ORDER BY r.reservationTime DESC")
    List<ReservationSeat> findByUserId(@Param("userId") Long userId);
    
    // 특정 영화의 예약 좌석 통계 (인기 좌석 파악용)
    @Query("SELECT s.rowName, s.columnNumber, COUNT(rs.id) as count FROM ReservationSeat rs JOIN rs.seat s JOIN rs.reservation r JOIN r.schedule sc WHERE sc.movie.id = :movieId GROUP BY s.rowName, s.columnNumber ORDER BY count DESC")
    List<Object[]> findSeatStatisticsByMovieId(@Param("movieId") Long movieId);
    
    // 특정 상영관의 예약 좌석 통계 (인기 좌석 파악용)
    @Query("SELECT s.rowName, s.columnNumber, COUNT(rs.id) as count FROM ReservationSeat rs JOIN rs.seat s WHERE s.screen.id = :screenId GROUP BY s.rowName, s.columnNumber ORDER BY count DESC")
    List<Object[]> findSeatStatisticsByScreenId(@Param("screenId") Long screenId);

	List<ReservationSeat> findBySeatIdIn(List<Long> reservedSeatIds);

	List<ReservationSeat> findByReservation(Reservation reservation);

	void deleteByReservation(Reservation reservation);

	boolean existsBySeatAndReservationSchedule(Seat seat, Schedule schedule);
}
