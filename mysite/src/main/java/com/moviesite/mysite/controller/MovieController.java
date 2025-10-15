package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.moviesite.mysite.model.dto.request.MovieRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.MovieResponse;
import com.moviesite.mysite.service.MovieService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {
	
	private final MovieService movieService;

    // 모든 영화 목록 조회 (페이징 처리)
    @GetMapping
    public ResponseEntity<ApiResponse<Page<MovieResponse>>> getAllMovies(
            @RequestParam(name = "title", required = false) String title,
            @RequestParam(name = "status", required = false) String status,
            Pageable pageable) {
        Page<MovieResponse> movies = movieService.getAllMovies(title, status, pageable);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    // 현재 상영 중인 영화 목록 조회
    @GetMapping("/now-showing")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getNowPlayingMovies() {
        List<MovieResponse> movies = movieService.getNowPlayingMovies();
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    // 상영 예정 영화 목록 조회
    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getUpcomingMovies() {
        List<MovieResponse> movies = movieService.getUpcomingMovies();
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    // 특정 영화 상세 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Long id) {
        MovieResponse movie = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success(movie));
    }

    // 영화 검색
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> searchMovies(@RequestParam String keyword) {
        List<MovieResponse> movies = movieService.searchMovies(keyword);
        return ResponseEntity.ok(ApiResponse.success(movies));
    }

    // 영화 등록 (관리자 권한 필요)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(@Valid @RequestBody MovieRequest movieRequest) {
        MovieResponse createdMovie = movieService.createMovie(movieRequest);
        return new ResponseEntity<>(ApiResponse.success("영화가 성공적으로 등록되었습니다.", createdMovie), HttpStatus.CREATED);
    }

    // 영화 수정 (관리자 권한 필요)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(
            @PathVariable Long id,
            @Valid @RequestBody MovieRequest movieRequest) {
        MovieResponse updatedMovie = movieService.updateMovie(id, movieRequest);
        return ResponseEntity.ok(ApiResponse.success("영화 정보가 성공적으로 수정되었습니다.", updatedMovie));
    }

    // 영화 삭제 (관리자 권한 필요)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(ApiResponse.success("영화가 성공적으로 삭제되었습니다.", null));
    }

    // 영화 포스터 업로드 (관리자 권한 필요)
    @PostMapping("/{id}/poster")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MovieResponse>> uploadPoster(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        MovieResponse updatedMovie = movieService.uploadPoster(id, file);
        return ResponseEntity.ok(ApiResponse.success("영화 포스터가 성공적으로 업로드되었습니다.", updatedMovie));
    }
}