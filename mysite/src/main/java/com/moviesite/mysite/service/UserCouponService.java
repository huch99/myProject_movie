package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.dto.UserCouponDTO;
import com.moviesite.mysite.model.entity.Coupon;
import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.UserCoupon;
import com.moviesite.mysite.repository.CouponRepository;
import com.moviesite.mysite.repository.ReservationRepository;
import com.moviesite.mysite.repository.UserCouponRepository;
import com.moviesite.mysite.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserCouponService {

	private final UserCouponRepository userCouponRepository;
	private final CouponRepository couponRepository;
	private final UserRepository userRepository;
	private final ReservationRepository reservationRepository;

	// 현재 로그인한 사용자의 모든 쿠폰 조회
	public List<UserCouponDTO> getMyUserCoupons() {
		User currentUser = getCurrentUser();
		List<UserCoupon> userCoupons = userCouponRepository.findByUser(currentUser);

		return userCoupons.stream().map(UserCouponDTO::fromEntity).collect(Collectors.toList());
	}

	// 현재 로그인한 사용자의 사용 가능한 쿠폰 조회
	public List<UserCouponDTO> getMyAvailableUserCoupons() {
		User currentUser = getCurrentUser();
		List<UserCoupon> availableCoupons = userCouponRepository.findByUserAndUsedFalseAndExpiredFalse(currentUser);

		return availableCoupons.stream().map(UserCouponDTO::fromEntity).collect(Collectors.toList());
	}

	// 특정 사용자의 쿠폰 조회 (관리자용)
	public List<UserCouponDTO> getUserCouponsByUserId(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

		List<UserCoupon> userCoupons = userCouponRepository.findByUser(user);

		return userCoupons.stream().map(UserCouponDTO::fromEntity).collect(Collectors.toList());
	}

	// 특정 사용자 쿠폰 조회
	public UserCouponDTO getUserCouponById(Long id) {
		UserCoupon userCoupon = getUserCouponEntityById(id);

		// 현재 사용자가 쿠폰 소유자인지 확인
		validateUserCouponOwnership(userCoupon);

		return UserCouponDTO.fromEntity(userCoupon);
	}

	// 쿠폰 코드 등록
	@Transactional
	public Map<String, Object> redeemCoupon(String couponCode) {
		// 쿠폰 존재 여부 확인
		Coupon coupon = couponRepository.findByCouponCode(couponCode)
				.orElseThrow(() -> new EntityNotFoundException("Invalid coupon code: " + couponCode));

		// 쿠폰 유효성 검사
		validateCoupon(coupon);

		User currentUser = getCurrentUser();

		// 이미 등록한 쿠폰인지 확인
		if (userCouponRepository.existsByUserAndCoupon(currentUser, coupon)) {
			throw new IllegalStateException("You have already registered this coupon");
		}

		// 사용자당 사용 제한 확인
		if (coupon.getUsageLimitPerUser() != null) {
			long usageCount = userCouponRepository.countByUserAndCoupon(currentUser, coupon);
			if (usageCount >= coupon.getUsageLimitPerUser()) {
				throw new IllegalStateException("You have reached the usage limit for this coupon");
			}
		}

		// 전체 사용 제한 확인
		if (coupon.getTotalUsageLimit() != null) {
			long totalUsage = userCouponRepository.countByCoupon(coupon);
			if (totalUsage >= coupon.getTotalUsageLimit()) {
				throw new IllegalStateException("This coupon has reached its total usage limit");
			}
		}

		// 사용자에게 쿠폰 발급
		UserCoupon userCoupon = new UserCoupon();
		userCoupon.setUser(currentUser);
		userCoupon.setCoupon(coupon);
		userCoupon.setIssueDate(LocalDateTime.now());
		userCoupon.setExpiryDate(coupon.getExpiryDate());
		userCoupon.setUsed(false);
		userCoupon.setExpired(false);

		UserCoupon savedUserCoupon = userCouponRepository.save(userCoupon);

		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("message", "쿠폰이 성공적으로 등록되었습니다");
		result.put("userCoupon", UserCouponDTO.fromEntity(savedUserCoupon));

		return result;
	}

	// 특정 예매에 쿠폰 적용
	@Transactional
	public Map<String, Object> applyCoupon(Long userCouponId, Long reservationId) {
		// 사용자 쿠폰 존재 여부 확인
		UserCoupon userCoupon = getUserCouponEntityById(userCouponId);

		// 현재 사용자가 쿠폰 소유자인지 확인
		validateUserCouponOwnership(userCoupon);

		// 쿠폰 사용 가능 여부 확인
		if (userCoupon.getUsed()) {
			throw new IllegalStateException("This coupon has already been used");
		}

		if (userCoupon.getExpired()) {
			throw new IllegalStateException("This coupon has expired");
		}

		// 예매 존재 여부 확인
		Reservation reservation = reservationRepository.findById(reservationId)
				.orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + reservationId));

		// 현재 사용자가 예매 소유자인지 확인
		User currentUser = getCurrentUser();
		if (!reservation.getUser().getId().equals(currentUser.getId())) {
			throw new IllegalStateException("You don't have permission to apply coupon to this reservation");
		}

		// 쿠폰 적용 가능 여부 확인
		validateCouponApplicable(userCoupon.getCoupon(), reservation);

		// 할인 금액 계산
		BigDecimal discountAmount = calculateDiscountAmount(userCoupon.getCoupon(), reservation.getTotalPrice());

		// 예매 가격 업데이트
		BigDecimal newTotalPrice = reservation.getTotalPrice().subtract(discountAmount);
		reservation.setTotalPrice(newTotalPrice);

		// 쿠폰 사용 처리
		userCoupon.setUsed(true);
		userCoupon.setUsedDate(LocalDateTime.now());
		userCoupon.setReservationId(reservationId);

		// 저장
		userCouponRepository.save(userCoupon);
		reservationRepository.save(reservation);

		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("message", "쿠폰이 성공적으로 적용되었습니다");
		result.put("discountAmount", discountAmount);
		result.put("newTotalPrice", newTotalPrice);

		return result;
	}

	// 쿠폰 사용 취소
	@Transactional
	public UserCouponDTO cancelCouponUsage(Long id) {
		UserCoupon userCoupon = getUserCouponEntityById(id);

		// 현재 사용자가 쿠폰 소유자인지 확인
		validateUserCouponOwnership(userCoupon);

		// 쿠폰이 사용되었는지 확인
		if (!userCoupon.getUsed()) {
			throw new IllegalStateException("This coupon has not been used yet");
		}

		// 예매 존재 여부 확인
		Long reservationId = userCoupon.getReservationId();
		if (reservationId == null) {
			throw new IllegalStateException("This coupon is not associated with any reservation");
		}

		Reservation reservation = reservationRepository.findById(reservationId)
				.orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + reservationId));

		// 예매가 취소 가능한 상태인지 확인
		if (!reservation.isCancelable()) {
			throw new IllegalStateException(
					"The reservation cannot be modified (time limit exceeded or already completed)");
		}

		// 쿠폰 할인 금액 계산
		BigDecimal discountAmount = calculateDiscountAmount(userCoupon.getCoupon(), reservation.getTotalPrice()
				.add(calculateDiscountAmount(userCoupon.getCoupon(), reservation.getTotalPrice())));

		// 예매 가격 복원
		BigDecimal originalPrice = reservation.getTotalPrice().add(discountAmount);
		reservation.setTotalPrice(originalPrice);

		// 쿠폰 사용 취소 처리
		userCoupon.setUsed(false);
		userCoupon.setUsedDate(null);
		userCoupon.setReservationId(null);

		// 저장
		userCouponRepository.save(userCoupon);
		reservationRepository.save(reservation);

		return UserCouponDTO.fromEntity(userCoupon);
	}

	// 사용자에게 쿠폰 발급 (관리자용)
	@Transactional
	public UserCouponDTO issueUserCoupon(Long userId, Long couponId) {
		// 사용자 존재 여부 확인
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

		// 쿠폰 존재 여부 확인
		Coupon coupon = couponRepository.findById(couponId)
				.orElseThrow(() -> new EntityNotFoundException("Coupon not found with id: " + couponId));

		// 쿠폰 유효성 검사
		validateCoupon(coupon);

		// 사용자에게 쿠폰 발급
		UserCoupon userCoupon = new UserCoupon();
		userCoupon.setUser(user);
		userCoupon.setCoupon(coupon);
		userCoupon.setIssueDate(LocalDateTime.now());
		userCoupon.setExpiryDate(coupon.getExpiryDate());
		userCoupon.setUsed(false);
		userCoupon.setExpired(false);

		UserCoupon savedUserCoupon = userCouponRepository.save(userCoupon);

		return UserCouponDTO.fromEntity(savedUserCoupon);
	}

	// 사용자 쿠폰 삭제 (관리자용)
	@Transactional
	public void deleteUserCoupon(Long id) {
		if (!userCouponRepository.existsById(id)) {
			throw new EntityNotFoundException("User coupon not found with id: " + id);
		}

		userCouponRepository.deleteById(id);
	}

	// 곧 만료되는 쿠폰 조회
	public List<UserCouponDTO> getMyExpiringSoonCoupons() {
		User currentUser = getCurrentUser();

		// 오늘로부터 7일 이내에 만료되는 쿠폰 조회
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime future = now.plusDays(7);

		List<UserCoupon> expiringSoonCoupons = userCouponRepository.findSoonToExpireCoupons(currentUser.getId(), now,
				future);

		return expiringSoonCoupons.stream().map(UserCouponDTO::fromEntity).collect(Collectors.toList());
	}

	// 쿠폰 사용 가능 여부 확인
	public Map<String, Object> checkCouponApplicable(Long userCouponId, Long reservationId) {
		// 사용자 쿠폰 존재 여부 확인
		UserCoupon userCoupon = getUserCouponEntityById(userCouponId);

		// 현재 사용자가 쿠폰 소유자인지 확인
		validateUserCouponOwnership(userCoupon);

		// 쿠폰 사용 가능 여부 확인
		if (userCoupon.getUsed()) {
			return Map.of("applicable", false, "reason", "이미 사용된 쿠폰입니다");
		}

		if (userCoupon.getExpired()) {
			return Map.of("applicable", false, "reason", "만료된 쿠폰입니다");
		}

		// 예매 존재 여부 확인
		Reservation reservation = reservationRepository.findById(reservationId)
				.orElseThrow(() -> new EntityNotFoundException("Reservation not found with id: " + reservationId));

		// 쿠폰 적용 가능 여부 확인
		try {
			validateCouponApplicable(userCoupon.getCoupon(), reservation);

			// 할인 금액 계산
			BigDecimal discountAmount = calculateDiscountAmount(userCoupon.getCoupon(), reservation.getTotalPrice());
			BigDecimal newTotalPrice = reservation.getTotalPrice().subtract(discountAmount);

			Map<String, Object> result = new HashMap<>();
			result.put("applicable", true);
			result.put("discountAmount", discountAmount);
			result.put("originalPrice", reservation.getTotalPrice());
			result.put("newTotalPrice", newTotalPrice);

			return result;
		} catch (IllegalStateException e) {
			return Map.of("applicable", false, "reason", e.getMessage());
		}
	}

	// 사용자 쿠폰 엔티티 조회
	private UserCoupon getUserCouponEntityById(Long id) {
		return userCouponRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("User coupon not found with id: " + id));
	}

	// 현재 로그인한 사용자 조회
	private User getCurrentUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();

		return userRepository.findByEmail(email)
				.orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));
	}

	// 사용자 쿠폰 소유권 확인
	private void validateUserCouponOwnership(UserCoupon userCoupon) {
		User currentUser = getCurrentUser();

		// 관리자이거나 쿠폰 소유자인 경우에만 접근 허용
		if (!currentUser.isAdmin() && !userCoupon.getUser().getId().equals(currentUser.getId())) {
			throw new IllegalStateException("You don't have permission to access this coupon");
		}
	}

	// 쿠폰 유효성 검사
	private void validateCoupon(Coupon coupon) {
		LocalDateTime now = LocalDateTime.now();

		// 쿠폰 상태 확인
		if (coupon.getStatus() != Coupon.CouponStatus.ACTIVE) {
			throw new IllegalStateException("Coupon is not active");
		}

		// 발행일 확인
		if (now.isBefore(coupon.getIssueDate())) {
			throw new IllegalStateException("Coupon is not yet valid");
		}

		// 만료일 확인
		if (now.isAfter(coupon.getExpiryDate())) {
			throw new IllegalStateException("Coupon has expired");
		}
	}

	// 쿠폰 적용 가능 여부 확인
	private void validateCouponApplicable(Coupon coupon, Reservation reservation) {
		// 최소 주문 금액 확인
		if (coupon.getMinOrderPrice() != null && reservation.getTotalPrice().compareTo(coupon.getMinOrderPrice()) < 0) {
			throw new IllegalStateException("Order amount is less than the minimum required amount");
		}

		// 영화 특정 쿠폰 확인
		if (coupon.getCouponType() == Coupon.CouponType.MOVIE_SPECIFIC && coupon.getTargetMovie() != null
				&& !coupon.getTargetMovie().getId().equals(reservation.getSchedule().getMovie().getId())) {
			throw new IllegalStateException("This coupon is only applicable for specific movie");
		}

		// 극장 특정 쿠폰 확인
		if (coupon.getCouponType() == Coupon.CouponType.THEATER_SPECIFIC && coupon.getTargetTheater() != null && !coupon
				.getTargetTheater().getId().equals(reservation.getSchedule().getScreen().getTheater().getId())) {
			throw new IllegalStateException("This coupon is only applicable for specific theater");
		}
	}

	// 할인 금액 계산
	private BigDecimal calculateDiscountAmount(Coupon coupon, BigDecimal orderAmount) {
		BigDecimal discountAmount;

		if (coupon.getDiscountType() == Coupon.DiscountType.PERCENT) {
			// 퍼센트 할인
			discountAmount = orderAmount.multiply(coupon.getDiscountValue()).divide(new BigDecimal(100), 0,
					BigDecimal.ROUND_DOWN);

			// 최대 할인 금액 제한
			if (coupon.getMaxDiscountAmount() != null && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
				discountAmount = coupon.getMaxDiscountAmount();
			}
		} else {
			// 정액 할인
			discountAmount = coupon.getDiscountValue();

			// 주문 금액보다 할인 금액이 크면 주문 금액만큼만 할인
			if (discountAmount.compareTo(orderAmount) > 0) {
				discountAmount = orderAmount;
			}
		}

		return discountAmount;
	}
}
