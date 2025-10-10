package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.dto.SeatDTO;
import com.moviesite.mysite.service.SeatService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
public class SeatController {

	private final SeatService seatService;

    // 특정 좌석 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<SeatDTO> getSeatById(@PathVariable Long id) {
        return ResponseEntity.ok(seatService.getSeatById(id));
    }

    // 특정 상영관의 모든 좌석 조회
    @GetMapping("/screen/{screenId}")
    public ResponseEntity<List<SeatDTO>> getSeatsByScreenId(@PathVariable Long screenId) {
        return ResponseEntity.ok(seatService.getSeatsByScreenId(screenId));
    }

    // 특정 상영관의 좌석 배치도 조회
    @GetMapping("/screen/{screenId}/layout")
    public ResponseEntity<Map<String, List<SeatDTO>>> getScreenSeatLayout(@PathVariable Long screenId) {
        return ResponseEntity.ok(seatService.getScreenSeatLayout(screenId));
    }

    // 특정 타입의 좌석 조회
    @GetMapping("/screen/{screenId}/type/{seatType}")
    public ResponseEntity<List<SeatDTO>> getSeatsByType(
            @PathVariable Long screenId, 
            @PathVariable String seatType) {
        return ResponseEntity.ok(seatService.getSeatsByType(screenId, seatType));
    }

    // 새 좌석 등록 (관리자용)
    @PostMapping
    public ResponseEntity<SeatDTO> createSeat(@RequestBody SeatDTO seatDTO) {
        return new ResponseEntity<>(seatService.createSeat(seatDTO), HttpStatus.CREATED);
    }

    // 좌석 정보 수정 (관리자용)
    @PutMapping("/{id}")
    public ResponseEntity<SeatDTO> updateSeat(
            @PathVariable Long id,
            @RequestBody SeatDTO seatDTO) {
        return ResponseEntity.ok(seatService.updateSeat(id, seatDTO));
    }

    // 좌석 삭제 (관리자용)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeat(@PathVariable Long id) {
        seatService.deleteSeat(id);
        return ResponseEntity.noContent().build();
    }
    
    // 좌석 활성화/비활성화 (관리자용)
    @PatchMapping("/{id}/status")
    public ResponseEntity<SeatDTO> updateSeatStatus(
            @PathVariable Long id,
            @RequestParam Boolean isActive) {
        return ResponseEntity.ok(seatService.updateSeatStatus(id, isActive));
    }
    
    // 특정 상영 일정에 예약된 좌석 조회
    @GetMapping("/schedule/{scheduleId}")
    public ResponseEntity<List<SeatDTO>> getReservedSeatsByScheduleId(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(seatService.getReservedSeatsByScheduleId(scheduleId));
    }
    
    // 특정 상영 일정에 예약 가능한 좌석 조회
    @GetMapping("/schedule/{scheduleId}/available")
    public ResponseEntity<List<SeatDTO>> getAvailableSeatsByScheduleId(@PathVariable Long scheduleId) {
        return ResponseEntity.ok(seatService.getAvailableSeatsByScheduleId(scheduleId));
    }
    
    // 특정 행의 좌석 조회
    @GetMapping("/screen/{screenId}/row/{rowName}")
    public ResponseEntity<List<SeatDTO>> getSeatsByRow(
            @PathVariable Long screenId,
            @PathVariable String rowName) {
        return ResponseEntity.ok(seatService.getSeatsByRow(screenId, rowName));
    }
    
    // 여러 좌석 일괄 생성 (관리자용)
    @PostMapping("/batch")
    public ResponseEntity<List<SeatDTO>> createSeats(@RequestBody List<SeatDTO> seatDTOs) {
        return new ResponseEntity<>(seatService.createSeats(seatDTOs), HttpStatus.CREATED);
    }
}
