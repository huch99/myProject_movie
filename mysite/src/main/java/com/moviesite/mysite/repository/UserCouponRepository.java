package com.moviesite.mysite.repository;

import com.moviesite.mysite.model.entity.Coupon;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.UserCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {

    // 특정 사용자의 모든 쿠폰 조회
    List<UserCoupon> findByUserId(Long userId);

    // 특정 사용자의 사용 가능한 쿠폰 조회 (만료되지 않고 사용되지 않은)
    List<UserCoupon> findByUserIdAndUsedFalseAndExpiredFalseAndExpiryDateAfterOrderByExpiryDateAsc(
            Long userId, LocalDateTime now);

    // 특정 사용자의 만료된 쿠폰 조회
    List<UserCoupon> findByUserIdAndExpiredTrueOrderByExpiryDateDesc(Long userId);

    // 특정 사용자의 사용한 쿠폰 조회
    List<UserCoupon> findByUserIdAndUsedTrueOrderByUsedDateDesc(Long userId);

    // 특정 예약에 사용된 쿠폰 조회
    Optional<UserCoupon> findByReservationId(Long reservationId);

    // 만료 처리가 필요한 쿠폰 조회
    @Query("SELECT uc FROM UserCoupon uc WHERE uc.expired = false AND uc.used = false AND uc.expiryDate < :now")
    List<UserCoupon> findExpiredCoupons(@Param("now") LocalDateTime now);

	List<UserCoupon> findByUserAndUsedFalseAndExpiredFalse(User currentUser);

	void deleteByCouponId(Long id);

	boolean existsByUserAndCoupon(User currentUser, Coupon coupon);

	long countByUserAndCoupon(User currentUser, Coupon coupon);

	long countByCoupon(Coupon coupon);
}