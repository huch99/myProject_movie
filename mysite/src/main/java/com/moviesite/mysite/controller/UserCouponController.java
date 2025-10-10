package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.UserCouponRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.UserCouponResponse;
import com.moviesite.mysite.service.UserCouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-coupons")
@RequiredArgsConstructor
public class UserCouponController {

    private final UserCouponService userCouponService;

    // 현재 로그인한 사용자의 사용 가능한 쿠폰 목록 조회
    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<UserCouponResponse>>> getMyAvailableCoupons() {
        List<UserCouponResponse> userCoupons = userCouponService.getMyAvailableCoupons();
        return ResponseEntity.ok(ApiResponse.success(userCoupons));
    }

    // 현재 로그인한 사용자의 모든 쿠폰 목록 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyCoupons() {
        Map<String, Object> coupons = userCouponService.getMyCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    // 쿠폰 발급 (관리자용)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserCouponResponse>> issueUserCoupon(@Valid @RequestBody UserCouponRequest request) {
        UserCouponResponse issuedCoupon = userCouponService.issueUserCoupon(request);
        return new ResponseEntity<>(ApiResponse.success("쿠폰이 성공적으로 발급되었습니다.", issuedCoupon), HttpStatus.CREATED);
    }

    // 쿠폰 사용 처리
    @PostMapping("/{id}/use")
    public ResponseEntity<ApiResponse<UserCouponResponse>> useUserCoupon(
            @PathVariable Long id,
            @RequestParam Long reservationId) {
        UserCouponResponse usedCoupon = userCouponService.useUserCoupon(id, reservationId);
        return ResponseEntity.ok(ApiResponse.success("쿠폰이 성공적으로 사용되었습니다.", usedCoupon));
    }

    // 쿠폰 만료 처리 (관리자용)
    @PatchMapping("/{id}/expire")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserCouponResponse>> expireUserCoupon(@PathVariable Long id) {
        UserCouponResponse expiredCoupon = userCouponService.expireUserCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("쿠폰이 성공적으로 만료 처리되었습니다.", expiredCoupon));
    }
}