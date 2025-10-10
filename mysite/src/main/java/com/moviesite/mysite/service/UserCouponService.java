package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.UserCouponRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.UserCouponResponse;
import com.moviesite.mysite.model.entity.Coupon;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.UserCoupon;
import com.moviesite.mysite.repository.CouponRepository;
import com.moviesite.mysite.repository.UserCouponRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;

    // 현재 로그인한 사용자의 사용 가능한 쿠폰 목록 조회
    public List<UserCouponResponse> getMyAvailableCoupons() {
        User currentUser = getCurrentUser();
        LocalDateTime now = LocalDateTime.now();

        List<UserCoupon> userCoupons = userCouponRepository
                .findByUserIdAndUsedFalseAndExpiredFalseAndExpiryDateAfterOrderByExpiryDateAsc(
                        currentUser.getId(), now);

        return userCoupons.stream()
                .map(UserCouponResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 현재 로그인한 사용자의 모든 쿠폰 목록 조회
    public Map<String, Object> getMyCoupons() {
        User currentUser = getCurrentUser();

        List<UserCoupon> allCoupons = userCouponRepository.findByUserId(currentUser.getId());
        LocalDateTime now = LocalDateTime.now();

        // 사용 가능한 쿠폰
        List<UserCouponResponse> availableCoupons = allCoupons.stream()
                .filter(uc -> !uc.getUsed() && !uc.getExpired() && uc.getExpiryDate().isAfter(now))
                .map(UserCouponResponse::fromEntity)
                .collect(Collectors.toList());

        // 사용한 쿠폰
        List<UserCouponResponse> usedCoupons = allCoupons.stream()
                .filter(uc -> uc.getUsed())
                .map(UserCouponResponse::fromEntity)
                .collect(Collectors.toList());

        // 만료된 쿠폰
        List<UserCouponResponse> expiredCoupons = allCoupons.stream()
                .filter(uc -> uc.getExpired() || (!uc.getUsed() && uc.getExpiryDate().isBefore(now)))
                .map(UserCouponResponse::fromEntity)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("availableCoupons", availableCoupons);
        result.put("usedCoupons", usedCoupons);
        result.put("expiredCoupons", expiredCoupons);
        result.put("totalCount", allCoupons.size());
        result.put("availableCount", availableCoupons.size());

        return result;
    }

    // 쿠폰 발급 (관리자용)
    @Transactional
    public UserCouponResponse issueUserCoupon(UserCouponRequest request) {
        // 관리자 권한 확인
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        // 사용자 존재 여부 확인
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        // 쿠폰 존재 여부 확인
        Coupon coupon = couponRepository.findById(request.getCouponId())
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + request.getCouponId()));

        // 사용자 쿠폰 생성
        UserCoupon userCoupon = UserCoupon.builder()
                .user(user)
                .coupon(coupon)
                .issueDate(request.getIssueDate())
                .expiryDate(request.getExpiryDate())
                .used(false)
                .expired(false)
                .build();

        UserCoupon savedUserCoupon = userCouponRepository.save(userCoupon);
        return UserCouponResponse.fromEntity(savedUserCoupon);
    }

    // 쿠폰 사용 처리
    @Transactional
    public UserCouponResponse useUserCoupon(Long id, Long reservationId) {
        UserCoupon userCoupon = findUserCouponById(id);

        // 본인의 쿠폰인지 확인
        User currentUser = getCurrentUser();
        if (!userCoupon.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("해당 쿠폰에 접근할 권한이 없습니다");
        }

        // 쿠폰 사용 가능 여부 확인
        if (userCoupon.getUsed()) {
            throw new BadRequestException("이미 사용된 쿠폰입니다");
        }

        if (userCoupon.getExpired() || userCoupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("만료된 쿠폰입니다");
        }

        // 쿠폰 사용 처리
        userCoupon.setUsed(true);
        userCoupon.setUsedDate(LocalDateTime.now());
        userCoupon.setReservationId(reservationId);
        userCoupon.setUpdatedAt(LocalDateTime.now());

        UserCoupon updatedUserCoupon = userCouponRepository.save(userCoupon);
        return UserCouponResponse.fromEntity(updatedUserCoupon);
    }

    // 쿠폰 만료 처리 (관리자용)
    @Transactional
    public UserCouponResponse expireUserCoupon(Long id) {
        // 관리자 권한 확인
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        UserCoupon userCoupon = findUserCouponById(id);

        if (userCoupon.getUsed()) {
            throw new BadRequestException("이미 사용된 쿠폰은 만료 처리할 수 없습니다");
        }

        if (userCoupon.getExpired()) {
            throw new BadRequestException("이미 만료된 쿠폰입니다");
        }

        // 쿠폰 만료 처리
        userCoupon.setExpired(true);
        userCoupon.setUpdatedAt(LocalDateTime.now());

        UserCoupon updatedUserCoupon = userCouponRepository.save(userCoupon);
        return UserCouponResponse.fromEntity(updatedUserCoupon);
    }

    // 만료된 쿠폰 일괄 처리 (스케줄링)
    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // 매일 자정에 실행
    public void processExpiredCoupons() {
        LocalDateTime now = LocalDateTime.now();
        List<UserCoupon> expiredCoupons = userCouponRepository.findExpiredCoupons(now);

        for (UserCoupon userCoupon : expiredCoupons) {
            userCoupon.setExpired(true);
            userCoupon.setUpdatedAt(now);
        }

        userCouponRepository.saveAll(expiredCoupons);
    }

    // UserCoupon 엔티티 조회 (내부 메서드)
    private UserCoupon findUserCouponById(Long id) {
        return userCouponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("UserCoupon not found with id: " + id));
    }

    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}