package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.Reservation.ReservationStatus;
import com.moviesite.mysite.model.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	// 특정 사용자의 예매 내역 조회
    List<Reservation> findByUserIdOrderByReservationTimeDesc(Long userId);
    
    // 특정 상영 일정의 예매 내역 조회
    List<Reservation> findByScheduleId(Long scheduleId);
    
    // 특정 상태의 예매 내역 조회
    List<Reservation> findByStatus(Reservation.ReservationStatus status);
    
    // 특정 결제 상태의 예매 내역 조회
    List<Reservation> findByPaymentStatus(Reservation.PaymentStatus paymentStatus);
    
    // 특정 영화의 예매 내역 조회
    @Query("SELECT r FROM Reservation r WHERE r.schedule.movie.id = :movieId")
    List<Reservation> findByMovieId(@Param("movieId") Long movieId);
    
    // 특정 극장의 예매 내역 조회
    @Query("SELECT r FROM Reservation r WHERE r.schedule.screen.theater.id = :theaterId")
    List<Reservation> findByTheaterId(@Param("theaterId") Long theaterId);
    
    // 특정 기간의 예매 내역 조회
    List<Reservation> findByReservationTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // 특정 금액 이상의 예매 내역 조회
    List<Reservation> findByTotalPriceGreaterThanEqual(BigDecimal totalPrice);
    
    // 특정 사용자의 특정 상태 예매 내역 조회
    List<Reservation> findByUserIdAndStatus(Long userId, Reservation.ReservationStatus status);
    
    // 특정 사용자의 특정 기간 예매 내역 조회
    List<Reservation> findByUserIdAndReservationTimeBetween(
            Long userId, LocalDateTime start, LocalDateTime end);
    
    // 특정 사용자의 예매 수 조회
    Long countByUserId(Long userId);
    
    // 특정 영화의 예매 수 조회
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.schedule.movie.id = :movieId AND r.status = 'CONFIRMED'")
    Long countConfirmedReservationsByMovieId(@Param("movieId") Long movieId);
    
    // 특정 극장의 예매 수 조회
    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.schedule.screen.theater.id = :theaterId AND r.status = 'CONFIRMED'")
    Long countConfirmedReservationsByTheaterId(@Param("theaterId") Long theaterId);
    
    // 특정 날짜의 예매 수 조회
    @Query("SELECT COUNT(r) FROM Reservation r WHERE DATE(r.reservationTime) = :date AND r.status = 'CONFIRMED'")
    Long countConfirmedReservationsByDate(@Param("date") java.sql.Date date);
    
    // 영화별 예매 통계
    @Query("SELECT r.schedule.movie.id, r.schedule.movie.title, COUNT(r) as count " +
           "FROM Reservation r WHERE r.status = 'CONFIRMED' " +
           "GROUP BY r.schedule.movie.id, r.schedule.movie.title ORDER BY count DESC")
    List<Object[]> findMovieReservationStats();
    
    // 극장별 예매 통계
    @Query("SELECT r.schedule.screen.theater.id, r.schedule.screen.theater.name, COUNT(r) as count " +
           "FROM Reservation r WHERE r.status = 'CONFIRMED' " +
           "GROUP BY r.schedule.screen.theater.id, r.schedule.screen.theater.name ORDER BY count DESC")
    List<Object[]> findTheaterReservationStats();
    
    // 결제 방법별 예매 통계
    @Query("SELECT r.paymentMethod, COUNT(r) as count " +
           "FROM Reservation r WHERE r.status = 'CONFIRMED' " +
           "GROUP BY r.paymentMethod ORDER BY count DESC")
    List<Object[]> findPaymentMethodStats();

    // 기간 내 총 예매 수
	Long countByReservationTimeBetween(LocalDateTime startDateTime, LocalDateTime endDateTime);

	@Query("SELECT SUM(r.totalPrice) FROM Reservation r WHERE r.reservationTime BETWEEN :startDate AND :endDate AND r.status = :status")
    BigDecimal sumTotalPriceByReservationTimeBetweenAndStatus(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate,
        @Param("status") Reservation.ReservationStatus status);
	
	Page<Reservation> findByUserOrderByReservationTimeDesc(User currentUser, Pageable pageable);

	Page<Reservation> findAll(Specification<Reservation> spec, Pageable pageable);

	long countByStatus(ReservationStatus confirmed);
}
