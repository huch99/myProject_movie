package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.ScreenRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.ScreenResponse;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.service.ScreenService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/screens")
@RequiredArgsConstructor
public class ScreenController {

    private final ScreenService screenService;
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ScreenResponse>>> getAllScreens(
    		@RequestParam(name = "name", required = false) String name,
            Pageable pageable) {
        Page<ScreenResponse> screens = screenService.getAllScreens(name, pageable);
        return ResponseEntity.ok(ApiResponse.success(screens));
    }

    // 특정 극장의 모든 상영관 조회
    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<ApiResponse<List<ScreenResponse>>> getScreensByTheaterId(@PathVariable Long theaterId) {
        List<ScreenResponse> screens = screenService.getScreensByTheaterId(theaterId);
        return ResponseEntity.ok(ApiResponse.success(screens));
    }

    // 특정 상영관 상세 조회
    @GetMapping("/{theaterId}")
    public ResponseEntity<ApiResponse<ScreenResponse>> getScreenById(@PathVariable Long id) {
        ScreenResponse screen = screenService.getScreenById(id);
        return ResponseEntity.ok(ApiResponse.success(screen));
    }

    // 상영관 생성 (관리자용)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScreenResponse>> createScreen(@Valid @RequestBody ScreenRequest request) {
        ScreenResponse createdScreen = screenService.createScreen(request);
        return new ResponseEntity<>(ApiResponse.success("상영관이 성공적으로 등록되었습니다.", createdScreen), HttpStatus.CREATED);
    }

    // 상영관 수정 (관리자용)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScreenResponse>> updateScreen(
            @PathVariable Long id,
            @Valid @RequestBody ScreenRequest request) {
        ScreenResponse updatedScreen = screenService.updateScreen(id, request);
        return ResponseEntity.ok(ApiResponse.success("상영관 정보가 성공적으로 수정되었습니다.", updatedScreen));
    }

    // 상영관 삭제 (관리자용)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteScreen(@PathVariable Long id) {
        screenService.deleteScreen(id);
        return ResponseEntity.ok(ApiResponse.success("상영관이 성공적으로 삭제되었습니다.", null));
    }
}