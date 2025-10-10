package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Coupon;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, Long> {

	// 쿠폰 코드로 쿠폰 조회
    Optional<Coupon> findByCouponCode(String couponCode);
    
    // 쿠폰 코드 존재 여부 확인
    boolean existsByCouponCode(String couponCode);
    
    // 특정 상태의 쿠폰 목록 조회
    Page<Coupon> findByStatus(Coupon.CouponStatus status, Pageable pageable);
    
    // 유효한 쿠폰 목록 조회 (만료되지 않은 쿠폰)
    List<Coupon> findByExpiryDateAfterAndStatus(LocalDateTime now, Coupon.CouponStatus status);
    
    // 특정 타입의 쿠폰 목록 조회
    List<Coupon> findByCouponType(Coupon.CouponType couponType);
    
    // 특정 영화에 적용 가능한 쿠폰 목록 조회
    @Query("SELECT c FROM Coupon c WHERE c.targetMovie.id = :movieId OR c.couponType != 'MOVIE_SPECIFIC'")
    List<Coupon> findByTargetMovieIdOrNotMovieSpecific(@Param("movieId") Long movieId);
    
    // 특정 극장에 적용 가능한 쿠폰 목록 조회
    @Query("SELECT c FROM Coupon c WHERE c.targetTheater.id = :theaterId OR c.couponType != 'THEATER_SPECIFIC'")
    List<Coupon> findByTargetTheaterIdOrNotTheaterSpecific(@Param("theaterId") Long theaterId);
    
    // 특정 금액 이상 주문에 적용 가능한 쿠폰 목록 조회
    List<Coupon> findByMinOrderPriceLessThanEqual(BigDecimal amount);
    
    // 최근 생성된 쿠폰 목록 조회
    List<Coupon> findTop10ByOrderByCreatedAtDesc();
    
    // 곧 만료되는 쿠폰 목록 조회
    @Query("SELECT c FROM Coupon c WHERE c.expiryDate BETWEEN :now AND :future AND c.status = 'ACTIVE'")
    List<Coupon> findSoonToExpireCoupons(@Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // 쿠폰명으로 쿠폰 검색
    List<Coupon> findByNameContaining(String name);
    
    // 할인 금액/비율이 가장 높은 쿠폰 목록 조회
    @Query("SELECT c FROM Coupon c WHERE c.discountType = 'AMOUNT' ORDER BY c.discountValue DESC")
    List<Coupon> findHighestDiscountAmountCoupons(Pageable pageable);
    
    @Query("SELECT c FROM Coupon c WHERE c.discountType = 'PERCENT' ORDER BY c.discountValue DESC")
    List<Coupon> findHighestDiscountPercentCoupons(Pageable pageable);
}
