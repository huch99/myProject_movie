package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Coupon;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.UserCoupon;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {
	
	 // 특정 사용자의 모든 쿠폰 조회
    List<UserCoupon> findByUser(User user);
    
    // 특정 사용자의 사용 가능한 쿠폰 조회
    List<UserCoupon> findByUserAndUsedFalseAndExpiredFalse(User user);
    
    // 특정 사용자의 사용한 쿠폰 조회
    List<UserCoupon> findByUserAndUsedTrue(User user);
    
    // 특정 사용자의 만료된 쿠폰 조회
    List<UserCoupon> findByUserAndExpiredTrue(User user);
    
    // 특정 사용자의 특정 쿠폰 조회
    List<UserCoupon> findByUserAndCoupon(User user, Coupon coupon);
    
    // 특정 사용자가 특정 쿠폰을 가지고 있는지 확인
    boolean existsByUserAndCoupon(User user, Coupon coupon);
    
    // 특정 쿠폰의 사용자 수 조회
    long countByCoupon(Coupon coupon);
    
    // 특정 사용자의 특정 쿠폰 사용 횟수 조회
    long countByUserAndCoupon(User user, Coupon coupon);
    
    // 특정 예매에 사용된 쿠폰 조회
    List<UserCoupon> findByReservationId(Long reservationId);
    
    // 곧 만료되는 사용자 쿠폰 조회
    @Query("SELECT uc FROM UserCoupon uc WHERE uc.user.id = :userId AND uc.used = false AND uc.expired = false AND uc.expiryDate BETWEEN :now AND :future")
    List<UserCoupon> findSoonToExpireCoupons(@Param("userId") Long userId, @Param("now") LocalDateTime now, @Param("future") LocalDateTime future);
    
    // 특정 쿠폰의 모든 사용자 쿠폰 삭제 (쿠폰 삭제 시)
    void deleteByCouponId(Long couponId);
}
