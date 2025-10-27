package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.ScreeningRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.ScreeningResponse;
import com.moviesite.mysite.service.ScreeningService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/screenings")
@RequiredArgsConstructor
public class ScreeningController {

    private final ScreeningService screeningService;

    // 특정 영화의 상영 정보 조회
    @GetMapping("/movies/{movieId}")
    public ResponseEntity<ApiResponse<List<ScreeningResponse>>> getScreeningsByMovie(@PathVariable Long movieId) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsByMovie(movieId);
        return ResponseEntity.ok(ApiResponse.success(screenings));
    }

    // 특정 상영관의 상영 정보 조회
    @GetMapping("/screens/{screenId}")
    public ResponseEntity<ApiResponse<List<ScreeningResponse>>> getScreeningsByScreen(@PathVariable Long screenId) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsByScreen(screenId);
        return ResponseEntity.ok(ApiResponse.success(screenings));
    }

    // 특정 스케줄의 상영 정보 조회
    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<ApiResponse<List<ScreeningResponse>>> getScreeningsBySchedule(@PathVariable Long scheduleId) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsBySchedule(scheduleId);
        return ResponseEntity.ok(ApiResponse.success(screenings));
    }

    // 특정 상영 정보 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScreeningResponse>> getScreeningById(@PathVariable Long id) {
        ScreeningResponse screening = screeningService.getScreeningById(id);
        return ResponseEntity.ok(ApiResponse.success(screening));
    }

    // 상영 정보 생성 (관리자용)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScreeningResponse>> createScreening(@Valid @RequestBody ScreeningRequest request) {
        ScreeningResponse createdScreening = screeningService.createScreening(request);
        return new ResponseEntity<>(ApiResponse.success("상영 정보가 성공적으로 등록되었습니다.", createdScreening), HttpStatus.CREATED);
    }

    // 상영 정보 수정 (관리자용)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScreeningResponse>> updateScreening(
            @PathVariable Long id,
            @Valid @RequestBody ScreeningRequest request) {
        ScreeningResponse updatedScreening = screeningService.updateScreening(id, request);
        return ResponseEntity.ok(ApiResponse.success("상영 정보가 성공적으로 수정되었습니다.", updatedScreening));
    }

    // 상영 정보 상태 변경 (관리자용)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScreeningResponse>> updateScreeningStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ScreeningResponse updatedScreening = screeningService.updateScreeningStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("상영 정보 상태가 성공적으로 변경되었습니다.", updatedScreening));
    }

    // 상영 정보 삭제 (관리자용)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteScreening(@PathVariable Long id) {
        screeningService.deleteScreening(id);
        return ResponseEntity.ok(ApiResponse.success("상영 정보가 성공적으로 삭제되었습니다.", null));
    }
}