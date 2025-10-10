package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Payment;
import com.moviesite.mysite.model.entity.Payment.PaymentStatus;
import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

	// 특정 예매의 결제 정보 조회
    Optional<Payment> findByReservationId(Long reservationId);
    
    // 특정 사용자의 결제 내역 조회
    List<Payment> findByUserIdOrderByPaymentTimeDesc(Long userId);
    
    // 특정 결제 상태의 결제 내역 조회
    List<Payment> findByPaymentStatus(Payment.PaymentStatus paymentStatus);
    
    // 특정 결제 방법의 결제 내역 조회
    List<Payment> findByPaymentMethod(String paymentMethod);
    
    // 특정 기간의 결제 내역 조회
    List<Payment> findByPaymentTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // 특정 금액 이상의 결제 내역 조회
    List<Payment> findByAmountGreaterThanEqual(BigDecimal amount);
    
    // 특정 사용자의 특정 상태 결제 내역 조회
    List<Payment> findByUserIdAndPaymentStatus(Long userId, Payment.PaymentStatus paymentStatus);
    
    // 특정 트랜잭션 ID로 결제 내역 조회
    Optional<Payment> findByTransactionId(String transactionId);
    
    // 특정 카드사의 결제 내역 조회
    List<Payment> findByCardCompany(String cardCompany);
    
    // 특정 기간 내 결제 총액 조회
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.paymentTime BETWEEN :startTime AND :endTime AND p.paymentStatus = :status")
    BigDecimal sumAmountByPaymentTimeBetweenAndStatus(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("status") Payment.PaymentStatus status);
    
    // 결제 방법별 통계
    @Query("SELECT p.paymentMethod, COUNT(p) as count, SUM(p.amount) as total FROM Payment p " +
           "WHERE p.paymentTime BETWEEN :startTime AND :endTime AND p.paymentStatus = 'COMPLETED' " +
           "GROUP BY p.paymentMethod ORDER BY total DESC")
    List<Object[]> findPaymentMethodStats(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    // 카드사별 통계
    @Query("SELECT p.cardCompany, COUNT(p) as count, SUM(p.amount) as total FROM Payment p " +
           "WHERE p.paymentMethod = 'CARD' AND p.paymentTime BETWEEN :startTime AND :endTime " +
           "AND p.paymentStatus = 'COMPLETED' GROUP BY p.cardCompany ORDER BY total DESC")
    List<Object[]> findCardCompanyStats(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);
    
    // 할부 개월 수별 통계
    @Query("SELECT p.installment, COUNT(p) as count, SUM(p.amount) as total FROM Payment p " +
           "WHERE p.paymentMethod = 'CARD' AND p.installment > 0 AND p.paymentTime BETWEEN :startTime AND :endTime " +
           "AND p.paymentStatus = 'COMPLETED' GROUP BY p.installment ORDER BY p.installment")
    List<Object[]> findInstallmentStats(
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

	List<Payment> findByUserOrderByPaymentTimeDesc(User currentUser);

	Page<Payment> findByPaymentStatusAndPaymentMethod(PaymentStatus paymentStatus, String method, Pageable pageable);

	Page<Payment> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);

	Page<Payment> findByPaymentMethod(String method, Pageable pageable);

	Optional<Payment> findByReservation(Reservation reservation);
}
