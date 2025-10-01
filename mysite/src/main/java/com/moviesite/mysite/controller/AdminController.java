package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.response.UserResponse;
import com.moviesite.mysite.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')") // 이 컨트롤러의 모든 메서드는 ADMIN 역할이 있어야 접근 가능
public class AdminController {
	@Autowired
	private UserService userService; // 사용자 관리 기능 등을 AdminController에 포함 가능

    // 모든 사용자 정보 조회 (ADMIN 권한)
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 특정 사용자 역할 변경 (예: USER -> ADMIN)
    // 실제 구현에서는 UserUpdateRequest에 역할 변경 필드를 포함하고, DTO 유효성 검사를 강화해야 합니다.
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<UserResponse> updateUserRole(@PathVariable Long userId, @RequestParam String newRole) {
        UserResponse updatedUser = userService.updateUserRole(userId, newRole);
        return ResponseEntity.ok(updatedUser);
    }

    // (필요하다면) 시스템 통계, 데이터 관리 등의 Admin 전용 기능 추가
}
