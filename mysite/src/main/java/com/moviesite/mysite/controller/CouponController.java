package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.CouponRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.CouponResponse;
import com.moviesite.mysite.service.CouponService;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

	private final CouponService couponService;

    // 관리자: 모든 쿠폰 목록 조회 (페이징 처리)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<CouponResponse>>> getAllCoupons(
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<CouponResponse> coupons = couponService.getAllCoupons(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    // 사용자: 본인의 사용 가능한 쿠폰 목록 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getMyAvailableCoupons() {
        List<CouponResponse> coupons = couponService.getMyAvailableCoupons();
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }

    // 특정 쿠폰 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long id) {
        CouponResponse coupon = couponService.getCouponById(id);
        return ResponseEntity.ok(ApiResponse.success(coupon));
    }

    // 쿠폰 코드로 쿠폰 조회
    @GetMapping("/code/{code}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponByCode(@PathVariable String code) {
        CouponResponse coupon = couponService.getCouponByCode(code);
        return ResponseEntity.ok(ApiResponse.success(coupon));
    }

    // 관리자: 새 쿠폰 생성
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponRequest couponRequest) {
        CouponResponse createdCoupon = couponService.createCoupon(couponRequest);
        return new ResponseEntity<>(ApiResponse.success("쿠폰이 성공적으로 생성되었습니다.", createdCoupon), HttpStatus.CREATED);
    }

    // 관리자: 쿠폰 정보 수정
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable Long id,
            @Valid @RequestBody CouponRequest couponRequest) {
        CouponResponse updatedCoupon = couponService.updateCoupon(id, couponRequest);
        return ResponseEntity.ok(ApiResponse.success("쿠폰 정보가 성공적으로 수정되었습니다.", updatedCoupon));
    }

    // 관리자: 쿠폰 상태 변경
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCouponStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        CouponResponse updatedCoupon = couponService.updateCouponStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("쿠폰 상태가 성공적으로 변경되었습니다.", updatedCoupon));
    }

    // 관리자: 쿠폰 삭제
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("쿠폰이 성공적으로 삭제되었습니다.", null));
    }
    
    // 쿠폰 코드 등록/사용
    @PostMapping("/redeem")
    public ResponseEntity<ApiResponse<Map<String, Object>>> redeemCoupon(@RequestBody Map<String, String> request) {
        String couponCode = request.get("couponCode");
        Map<String, Object> result = couponService.redeemCoupon(couponCode);
        return ResponseEntity.ok(ApiResponse.success("쿠폰이 성공적으로 등록되었습니다.", result));
    }
    
    // 예매 시 사용 가능한 쿠폰 목록 조회
    @GetMapping("/available-for-reservation")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getAvailableCouponsForReservation(
            @RequestParam(required = false) Long movieId,
            @RequestParam(required = false) Long theaterId,
            @RequestParam BigDecimal amount) {
        List<CouponResponse> coupons = couponService.getAvailableCouponsForReservation(movieId, theaterId, amount);
        return ResponseEntity.ok(ApiResponse.success(coupons));
    }
    
    // 관리자: 쿠폰 대량 생성
    @PostMapping("/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createCouponBatch(@RequestBody Map<String, Object> batchInfo) {
        Map<String, Object> result = couponService.createCouponBatch(batchInfo);
        return ResponseEntity.ok(ApiResponse.success("쿠폰이 성공적으로 대량 생성되었습니다.", result));
    }
}
