package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.dto.MovieDTO;
import com.moviesite.mysite.dto.ScreeningDTO;
import com.moviesite.mysite.service.ScreeningService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/screenings")
@RequiredArgsConstructor
public class ScreeningController {

	private final ScreeningService screeningService;

    // 모든 상영 정보 조회
    @GetMapping
    public ResponseEntity<List<ScreeningDTO>> getAllScreenings() {
        return ResponseEntity.ok(screeningService.getAllScreenings());
    }

    // 특정 상영 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ScreeningDTO> getScreeningById(@PathVariable Long id) {
        return ResponseEntity.ok(screeningService.getScreeningById(id));
    }

    // 특정 영화의 상영 정보 조회
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByMovieId(@PathVariable Long movieId) {
        return ResponseEntity.ok(screeningService.getScreeningsByMovieId(movieId));
    }

    // 특정 상영관의 상영 정보 조회
    @GetMapping("/screen/{screenId}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByScreenId(@PathVariable Long screenId) {
        return ResponseEntity.ok(screeningService.getScreeningsByScreenId(screenId));
    }

    // 특정 날짜의 상영 정보 조회
    @GetMapping("/date/{date}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(screeningService.getScreeningsByDate(date));
    }

    // 특정 영화, 특정 날짜의 상영 정보 조회
    @GetMapping("/movie/{movieId}/date/{date}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByMovieAndDate(
            @PathVariable Long movieId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(screeningService.getScreeningsByMovieAndDate(movieId, date));
    }

    // 특정 극장의 상영 정보 조회
    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByTheaterId(@PathVariable Long theaterId) {
        return ResponseEntity.ok(screeningService.getScreeningsByTheaterId(theaterId));
    }

    // 특정 극장, 특정 날짜의 상영 정보 조회
    @GetMapping("/theater/{theaterId}/date/{date}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByTheaterAndDate(
            @PathVariable Long theaterId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(screeningService.getScreeningsByTheaterAndDate(theaterId, date));
    }

    // 특정 극장, 특정 영화의 상영 정보 조회
    @GetMapping("/theater/{theaterId}/movie/{movieId}")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByTheaterAndMovie(
            @PathVariable Long theaterId,
            @PathVariable Long movieId) {
        return ResponseEntity.ok(screeningService.getScreeningsByTheaterAndMovie(theaterId, movieId));
    }

    // 새 상영 정보 등록 (관리자용)
    @PostMapping
    public ResponseEntity<ScreeningDTO> createScreening(@RequestBody ScreeningDTO screeningDTO) {
        return new ResponseEntity<>(screeningService.createScreening(screeningDTO), HttpStatus.CREATED);
    }

    // 상영 정보 수정 (관리자용)
    @PutMapping("/{id}")
    public ResponseEntity<ScreeningDTO> updateScreening(
            @PathVariable Long id,
            @RequestBody ScreeningDTO screeningDTO) {
        return ResponseEntity.ok(screeningService.updateScreening(id, screeningDTO));
    }

    // 상영 정보 삭제 (관리자용)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreening(@PathVariable Long id) {
        screeningService.deleteScreening(id);
        return ResponseEntity.noContent().build();
    }
    
    // 상영 정보 상태 변경 (관리자용)
    @PatchMapping("/{id}/status")
    public ResponseEntity<ScreeningDTO> updateScreeningStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(screeningService.updateScreeningStatus(id, status));
    }
    
    // 특정 날짜 범위의 상영 정보 조회
    @GetMapping("/date-range")
    public ResponseEntity<List<ScreeningDTO>> getScreeningsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(screeningService.getScreeningsByDateRange(startDate, endDate));
    }
    
    // 특정 날짜에 상영하는 영화 목록 조회
    @GetMapping("/movies/date/{date}")
    public ResponseEntity<List<MovieDTO>> getMoviesByScreeningDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(screeningService.getMoviesByScreeningDate(date));
    }
    
    // 특정 상영의 좌석 가용 상태 조회
    @GetMapping("/{id}/seats")
    public ResponseEntity<Map<String, Object>> getScreeningSeatsStatus(@PathVariable Long id) {
        return ResponseEntity.ok(screeningService.getScreeningSeatsStatus(id));
    }
}
