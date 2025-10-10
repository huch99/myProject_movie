package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.dto.ScheduleDTO;
import com.moviesite.mysite.dto.ScreenDTO;
import com.moviesite.mysite.dto.SeatDTO;
import com.moviesite.mysite.service.ScreenService;

import java.util.List;

@RestController
@RequestMapping("/api/screens")
@RequiredArgsConstructor
public class ScreenController {

	 private final ScreenService screenService;

	    // 모든 상영관 목록 조회
	    @GetMapping
	    public ResponseEntity<List<ScreenDTO>> getAllScreens() {
	        return ResponseEntity.ok(screenService.getAllScreens());
	    }

	    // 특정 상영관 정보 조회
	    @GetMapping("/{id}")
	    public ResponseEntity<ScreenDTO> getScreenById(@PathVariable Long id) {
	        return ResponseEntity.ok(screenService.getScreenById(id));
	    }

	    // 특정 극장의 상영관 목록 조회
	    @GetMapping("/theater/{theaterId}")
	    public ResponseEntity<List<ScreenDTO>> getScreensByTheaterId(@PathVariable Long theaterId) {
	        return ResponseEntity.ok(screenService.getScreensByTheaterId(theaterId));
	    }

	    // 특정 상영관의 좌석 배치도 조회
	    @GetMapping("/{id}/seats")
	    public ResponseEntity<List<SeatDTO>> getSeatsByScreenId(@PathVariable Long id) {
	        return ResponseEntity.ok(screenService.getSeatsByScreenId(id));
	    }

	    // 특정 타입의 상영관 조회
	    @GetMapping("/type/{type}")
	    public ResponseEntity<List<ScreenDTO>> getScreensByType(@PathVariable String type) {
	        return ResponseEntity.ok(screenService.getScreensByType(type));
	    }

	    // 새 상영관 등록 (관리자용)
	    @PostMapping
	    public ResponseEntity<ScreenDTO> createScreen(@RequestBody ScreenDTO screenDTO) {
	        return new ResponseEntity<>(screenService.createScreen(screenDTO), HttpStatus.CREATED);
	    }

	    // 상영관 정보 수정 (관리자용)
	    @PutMapping("/{id}")
	    public ResponseEntity<ScreenDTO> updateScreen(
	            @PathVariable Long id,
	            @RequestBody ScreenDTO screenDTO) {
	        return ResponseEntity.ok(screenService.updateScreen(id, screenDTO));
	    }

	    // 상영관 삭제 (관리자용)
	    @DeleteMapping("/{id}")
	    public ResponseEntity<Void> deleteScreen(@PathVariable Long id) {
	        screenService.deleteScreen(id);
	        return ResponseEntity.noContent().build();
	    }
	    
	    // 특정 상영관의 수용 인원 조회
	    @GetMapping("/{id}/capacity")
	    public ResponseEntity<Integer> getScreenCapacity(@PathVariable Long id) {
	        return ResponseEntity.ok(screenService.getScreenCapacity(id));
	    }
	    
	    // 특정 상영관의 현재 상영 중인 영화 조회
	    @GetMapping("/{id}/now-showing")
	    public ResponseEntity<List<ScheduleDTO>> getCurrentSchedulesByScreenId(@PathVariable Long id) {
	        return ResponseEntity.ok(screenService.getCurrentSchedulesByScreenId(id));
	    }
}
