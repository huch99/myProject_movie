package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.ReservationRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.ReservationResponse;
import com.moviesite.mysite.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    // 현재 로그인한 사용자의 모든 예매 내역 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Page<ReservationResponse>>> getMyReservations(Pageable pageable) {
        Page<ReservationResponse> reservations = reservationService.getMyReservations(pageable);
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    // 관리자: 모든 사용자의 예매 내역 조회 (필터링 및 페이징)
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ReservationResponse>>> getAllReservations(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) String movieTitle,
            @RequestParam(required = false) String status,
            Pageable pageable) {
        Page<ReservationResponse> reservations = reservationService.getAllReservations(userName, movieTitle, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(reservations));
    }

    // 특정 예매 상세 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReservationResponse>> getReservationById(@PathVariable Long id) {
        ReservationResponse reservation = reservationService.getReservationById(id);
        return ResponseEntity.ok(ApiResponse.success(reservation));
    }

    // 예매 생성
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(@Valid @RequestBody ReservationRequest reservationRequest) {
        ReservationResponse createdReservation = reservationService.createReservation(reservationRequest);
        return new ResponseEntity<>(ApiResponse.success("예매가 성공적으로 완료되었습니다.", createdReservation), HttpStatus.CREATED);
    }

    // 예매 취소
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, String>>> cancelReservation(@PathVariable Long id) {
        Map<String, String> result = reservationService.cancelReservation(id);
        return ResponseEntity.ok(ApiResponse.success(result.get("message"), result));
    }
    
    // 예매 상태 변경 (관리자용)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReservationResponse>> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ReservationResponse updatedReservation = reservationService.updateReservationStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("예매 상태가 성공적으로 변경되었습니다.", updatedReservation));
    }

    // 현재 상영 중인 영화의 예매 통계 (관리자용)
    @GetMapping("/admin/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReservationStatistics() {
        Map<String, Object> statistics = reservationService.getReservationStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
}