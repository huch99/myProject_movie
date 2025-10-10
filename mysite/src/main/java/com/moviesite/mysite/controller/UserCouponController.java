package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.dto.UserCouponDTO;
import com.moviesite.mysite.service.UserCouponService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-coupons")
@RequiredArgsConstructor
public class UserCouponController {

	private final UserCouponService userCouponService;

    // 현재 로그인한 사용자의 모든 쿠폰 조회
    @GetMapping("/me")
    public ResponseEntity<List<UserCouponDTO>> getMyUserCoupons() {
        return ResponseEntity.ok(userCouponService.getMyUserCoupons());
    }

    // 현재 로그인한 사용자의 사용 가능한 쿠폰 조회
    @GetMapping("/me/available")
    public ResponseEntity<List<UserCouponDTO>> getMyAvailableUserCoupons() {
        return ResponseEntity.ok(userCouponService.getMyAvailableUserCoupons());
    }

    // 특정 사용자의 쿠폰 조회 (관리자용)
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserCouponDTO>> getUserCouponsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(userCouponService.getUserCouponsByUserId(userId));
    }

    // 특정 사용자 쿠폰 조회
    @GetMapping("/{id}")
    public ResponseEntity<UserCouponDTO> getUserCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(userCouponService.getUserCouponById(id));
    }

    // 쿠폰 코드 등록
    @PostMapping("/redeem")
    public ResponseEntity<Map<String, Object>> redeemCoupon(@RequestBody Map<String, String> request) {
        String couponCode = request.get("couponCode");
        return ResponseEntity.ok(userCouponService.redeemCoupon(couponCode));
    }

    // 특정 예매에 쿠폰 적용
    @PostMapping("/apply")
    public ResponseEntity<Map<String, Object>> applyCoupon(
            @RequestBody Map<String, Object> request) {
        Long userCouponId = Long.parseLong(request.get("userCouponId").toString());
        Long reservationId = Long.parseLong(request.get("reservationId").toString());
        return ResponseEntity.ok(userCouponService.applyCoupon(userCouponId, reservationId));
    }

    // 쿠폰 사용 취소
    @PostMapping("/{id}/cancel")
    public ResponseEntity<UserCouponDTO> cancelCouponUsage(@PathVariable Long id) {
        return ResponseEntity.ok(userCouponService.cancelCouponUsage(id));
    }

    // 사용자에게 쿠폰 발급 (관리자용)
    @PostMapping("/issue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserCouponDTO> issueUserCoupon(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        Long couponId = Long.parseLong(request.get("couponId").toString());
        return new ResponseEntity<>(userCouponService.issueUserCoupon(userId, couponId), HttpStatus.CREATED);
    }

    // 사용자 쿠폰 삭제 (관리자용)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserCoupon(@PathVariable Long id) {
        userCouponService.deleteUserCoupon(id);
        return ResponseEntity.noContent().build();
    }
    
    // 곧 만료되는 쿠폰 조회
    @GetMapping("/me/expiring-soon")
    public ResponseEntity<List<UserCouponDTO>> getMyExpiringSoonCoupons() {
        return ResponseEntity.ok(userCouponService.getMyExpiringSoonCoupons());
    }
    
    // 쿠폰 사용 가능 여부 확인
    @GetMapping("/{id}/applicable")
    public ResponseEntity<Map<String, Object>> checkCouponApplicable(
            @PathVariable Long id,
            @RequestParam Long reservationId) {
        return ResponseEntity.ok(userCouponService.checkCouponApplicable(id, reservationId));
    }
}
