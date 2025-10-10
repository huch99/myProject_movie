package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.SeatRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.SeatResponse;
import com.moviesite.mysite.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;

    // 특정 상영관의 모든 좌석 조회
    @GetMapping("/screen/{screenId}")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeatsByScreenId(@PathVariable Long screenId) {
        List<SeatResponse> seats = seatService.getSeatsByScreenId(screenId);
        return ResponseEntity.ok(ApiResponse.success(seats));
    }

    // 특정 상영관의 활성화된 좌석만 조회
    @GetMapping("/screen/{screenId}/active")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getActiveSeats(@PathVariable Long screenId) {
        List<SeatResponse> seats = seatService.getActiveSeats(screenId);
        return ResponseEntity.ok(ApiResponse.success(seats));
    }

    // 상영관의 좌석 배치도 정보 조회
    @GetMapping("/screen/{screenId}/map")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSeatMap(@PathVariable Long screenId) {
        Map<String, Object> seatMap = seatService.getSeatMap(screenId);
        return ResponseEntity.ok(ApiResponse.success(seatMap));
    }

    // 특정 좌석 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SeatResponse>> getSeatById(@PathVariable Long id) {
        SeatResponse seat = seatService.getSeatById(id);
        return ResponseEntity.ok(ApiResponse.success(seat));
    }

    // 좌석 생성 (관리자용)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SeatResponse>> createSeat(@Valid @RequestBody SeatRequest request) {
        SeatResponse createdSeat = seatService.createSeat(request);
        return new ResponseEntity<>(ApiResponse.success("좌석이 성공적으로 등록되었습니다.", createdSeat), HttpStatus.CREATED);
    }

    // 좌석 정보 수정 (관리자용)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SeatResponse>> updateSeat(
            @PathVariable Long id,
            @Valid @RequestBody SeatRequest request) {
        SeatResponse updatedSeat = seatService.updateSeat(id, request);
        return ResponseEntity.ok(ApiResponse.success("좌석 정보가 성공적으로 수정되었습니다.", updatedSeat));
    }

    // 좌석 상태 변경 (활성화/비활성화) (관리자용)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SeatResponse>> updateSeatStatus(
            @PathVariable Long id,
            @RequestParam Boolean isActive) {
        SeatResponse updatedSeat = seatService.updateSeatStatus(id, isActive);
        return ResponseEntity.ok(ApiResponse.success("좌석 상태가 성공적으로 변경되었습니다.", updatedSeat));
    }

    // 좌석 삭제 (관리자용)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.ok(ApiResponse.success("좌석이 성공적으로 삭제되었습니다.", null));
    }

    // 상영관 좌석 일괄 생성 (관리자용)
    @PostMapping("/screen/{screenId}/batch")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> createSeatsForScreen(@PathVariable Long screenId) {
        List<SeatResponse> createdSeats = seatService.createSeatsForScreen(screenId);
        return new ResponseEntity<>(ApiResponse.success("상영관 좌석이 성공적으로 일괄 생성되었습니다.", createdSeats), HttpStatus.CREATED);
    }
}