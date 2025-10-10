package com.moviesite.mysite.controller;


import com.moviesite.mysite.model.dto.request.TheaterRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.service.TheaterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@RequiredArgsConstructor
public class TheaterController {
	private final TheaterService theaterService;

    // 모든 극장 목록 조회 (페이징 처리)
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TheaterResponse>>> getAllTheaters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            Pageable pageable) {
        Page<TheaterResponse> theaters = theaterService.getAllTheaters(name, location, pageable);
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }

    // 지역별 극장 목록 조회
    @GetMapping("/locations/{location}")
    public ResponseEntity<ApiResponse<List<TheaterResponse>>> getTheatersByLocation(@PathVariable String location) {
        List<TheaterResponse> theaters = theaterService.getTheatersByLocation(location);
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }

    // 특정 극장 상세 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TheaterResponse>> getTheaterById(@PathVariable Long id) {
        TheaterResponse theater = theaterService.getTheaterById(id);
        return ResponseEntity.ok(ApiResponse.success(theater));
    }

    // 극장 검색
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<TheaterResponse>>> searchTheaters(@RequestParam String keyword) {
        List<TheaterResponse> theaters = theaterService.searchTheaters(keyword);
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }

    // 특수 상영관이 있는 극장 목록 조회
    @GetMapping("/special-screens")
    public ResponseEntity<ApiResponse<List<TheaterResponse>>> getTheatersWithSpecialScreens(
            @RequestParam String screenType) {
        List<TheaterResponse> theaters = theaterService.getTheatersWithSpecialScreens(screenType);
        return ResponseEntity.ok(ApiResponse.success(theaters));
    }

    // 극장 등록 (관리자 권한 필요)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TheaterResponse>> createTheater(@Valid @RequestBody TheaterRequest theaterRequest) {
        TheaterResponse createdTheater = theaterService.createTheater(theaterRequest);
        return new ResponseEntity<>(ApiResponse.success("극장이 성공적으로 등록되었습니다.", createdTheater), HttpStatus.CREATED);
    }

    // 극장 정보 수정 (관리자 권한 필요)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TheaterResponse>> updateTheater(
            @PathVariable Long id,
            @Valid @RequestBody TheaterRequest theaterRequest) {
        TheaterResponse updatedTheater = theaterService.updateTheater(id, theaterRequest);
        return ResponseEntity.ok(ApiResponse.success("극장 정보가 성공적으로 수정되었습니다.", updatedTheater));
    }

    // 극장 삭제 (관리자 권한 필요)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTheater(@PathVariable Long id) {
        theaterService.deleteTheater(id);
        return ResponseEntity.ok(ApiResponse.success("극장이 성공적으로 삭제되었습니다.", null));
    }

    // 극장 이미지 업로드 (관리자 권한 필요)
    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TheaterResponse>> uploadTheaterImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        TheaterResponse updatedTheater = theaterService.uploadTheaterImage(id, file);
        return ResponseEntity.ok(ApiResponse.success("극장 이미지가 성공적으로 업로드되었습니다.", updatedTheater));
    }
}
