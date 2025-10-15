package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.PasswordChangeDTO;
import com.moviesite.mysite.model.dto.request.UserRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.model.dto.response.UserResponse;
import com.moviesite.mysite.model.entity.User.UserStatus;
import com.moviesite.mysite.service.UserService;
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
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    
//    @GetMapping
//    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers (
//    		@RequestParam(name = "email", required = false) String email,
//            @RequestParam(name = "name", required = false) String name,
//            @RequestParam(name = "status", required = false) UserStatus status,
//            Pageable pageable) {
//        Page<UserResponse> users = userService.getAllUsers(email, name, status, pageable);
//        return ResponseEntity.ok(ApiResponse.success(users));
//    }
    
//    @GetMapping
//    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
//            @RequestParam(name = "email", required = false) String email,
//            @RequestParam(name = "name", required = false) String name,
//            @RequestParam(name = "status", required = false) String statusStr,
//            Pageable pageable) {
//        
//        // String을 UserStatus로 안전하게 변환
//        UserStatus status = null;
//        if (statusStr != null && !statusStr.isEmpty()) {
//            try {
//                status = UserStatus.valueOf(statusStr.toUpperCase());
//            } catch (IllegalArgumentException e) {
//                return ResponseEntity.badRequest().body(ApiResponse.error("유효하지 않은 상태 값입니다."));
//            }
//        }
//        
//        Page<UserResponse> users = userService.getAllUsers(email, name, status, pageable);
//        return ResponseEntity.ok(ApiResponse.success(users));
//    }

    // 회원 가입
//    @PostMapping("/register")
//    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@Valid @RequestBody UserRequest userRequest) {
//        UserResponse createdUser = userService.registerUser(userRequest);
//        return new ResponseEntity<>(ApiResponse.success("회원가입이 성공적으로 완료되었습니다.", createdUser), HttpStatus.CREATED);
//    }

    // 현재 로그인한 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        UserResponse user = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    // 특정 사용자 정보 조회
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    // 사용자 정보 수정
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest userRequest) {
        UserResponse updatedUser = userService.updateUser(id, userRequest);
        return ResponseEntity.ok(ApiResponse.success("회원 정보가 성공적으로 수정되었습니다.", updatedUser));
    }

    // 비밀번호 변경
    @PostMapping("/{id}/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable Long id,
            @Valid @RequestBody PasswordChangeDTO passwordChangeDTO) {
        userService.changePassword(id, passwordChangeDTO.getCurrentPassword(), passwordChangeDTO.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("비밀번호가 성공적으로 변경되었습니다.", null));
    }

    // 프로필 이미지 업로드
    @PostMapping("/{id}/profile-image")
    public ResponseEntity<ApiResponse<UserResponse>> uploadProfileImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        UserResponse updatedUser = userService.uploadProfileImage(id, file);
        return ResponseEntity.ok(ApiResponse.success("프로필 이미지가 성공적으로 업로드되었습니다.", updatedUser));
    }

    // 사용자 목록 조회 (관리자용)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    // 사용자 상태 변경 (관리자용)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        UserResponse updatedUser = userService.updateUserStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("사용자 상태가 성공적으로 변경되었습니다.", updatedUser));
    }

    // 사용자 삭제 (관리자용)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("사용자가 성공적으로 삭제되었습니다.", null));
    }
}