package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.FavoriteRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.FavoriteResponse;
import com.moviesite.mysite.service.FavoriteService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

	private final FavoriteService favoriteService;

    // 현재 로그인한 사용자의 모든 즐겨찾기 조회
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyFavorites() {
        Map<String, Object> favorites = favoriteService.getMyFavorites();
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    // 현재 로그인한 사용자의 영화 즐겨찾기 조회
    @GetMapping("/movies")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavoriteMovies() {
        List<FavoriteResponse> favorites = favoriteService.getMyFavoriteMovies();
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    // 현재 로그인한 사용자의 극장 즐겨찾기 조회
    @GetMapping("/theaters")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavoriteTheaters() {
        List<FavoriteResponse> favorites = favoriteService.getMyFavoriteTheaters();
        return ResponseEntity.ok(ApiResponse.success(favorites));
    }

    // 즐겨찾기 추가
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(@Valid @RequestBody FavoriteRequest favoriteRequest) {
        FavoriteResponse createdFavorite = favoriteService.addFavorite(favoriteRequest);
        return new ResponseEntity<>(ApiResponse.success("즐겨찾기가 성공적으로 추가되었습니다.", createdFavorite), HttpStatus.CREATED);
    }

    // 영화 즐겨찾기 추가/삭제 토글
    @PostMapping("/movie/{movieId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleMovieFavorite(@PathVariable Long movieId) {
        Map<String, Object> result = favoriteService.toggleMovieFavorite(movieId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 극장 즐겨찾기 추가/삭제 토글
    @PostMapping("/theater/{theaterId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleTheaterFavorite(@PathVariable Long theaterId) {
        Map<String, Object> result = favoriteService.toggleTheaterFavorite(theaterId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 특정 영화가 즐겨찾기에 추가되었는지 확인
    @GetMapping("/movie/{movieId}/check")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkMovieFavorite(@PathVariable Long movieId) {
        Map<String, Boolean> result = favoriteService.checkMovieFavorite(movieId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 특정 극장이 즐겨찾기에 추가되었는지 확인
    @GetMapping("/theater/{theaterId}/check")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkTheaterFavorite(@PathVariable Long theaterId) {
        Map<String, Boolean> result = favoriteService.checkTheaterFavorite(theaterId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    // 즐겨찾기 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFavorite(@PathVariable Long id) {
        favoriteService.deleteFavorite(id);
        return ResponseEntity.ok(ApiResponse.success("즐겨찾기가 성공적으로 삭제되었습니다.", null));
    }
}
