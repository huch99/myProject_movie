package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.ScheduleRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.ScheduleResponse;
import com.moviesite.mysite.service.ScheduleService;
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
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    // 특정 상영 일정 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getScheduleById(@PathVariable Long id) {
        ScheduleResponse schedule = scheduleService.getScheduleById(id);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }

    // 상영 일정 등록 (관리자용)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse createdSchedule = scheduleService.createSchedule(request);
        return new ResponseEntity<>(ApiResponse.success("상영 일정이 성공적으로 등록되었습니다.", createdSchedule), HttpStatus.CREATED);
    }

    // 상영 일정 수정 (관리자용)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse updatedSchedule = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("상영 일정이 성공적으로 수정되었습니다.", updatedSchedule));
    }

    // 상영 일정 상태 변경 (관리자용)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateScheduleStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ScheduleResponse updatedSchedule = scheduleService.updateScheduleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("상영 일정 상태가 성공적으로 변경되었습니다.", updatedSchedule));
    }

    // 상영 일정 삭제 (관리자용)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("상영 일정이 성공적으로 삭제되었습니다.", null));
    }
}