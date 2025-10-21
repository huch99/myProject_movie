package com.moviesite.mysite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.moviesite.mysite.model.dto.request.LoginRequest;
import com.moviesite.mysite.model.dto.request.LogoutRequest;
import com.moviesite.mysite.model.dto.request.RefreshTokenRequest;
import com.moviesite.mysite.model.dto.request.RegisterRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.AuthResponse;
import com.moviesite.mysite.service.AuthService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest loginRequest) {
		AuthResponse authResponse = authService.login(loginRequest);
		return ResponseEntity.ok(ApiResponse.success(authResponse));
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest registerRequest) {
		System.out.println("RegisterRequest: " + registerRequest);
	    System.out.println("Password: " + (registerRequest.getPassword() != null ? "값 있음" : "null"));
		
		AuthResponse authResponse = authService.register(registerRequest);
		return ResponseEntity.ok(ApiResponse.success(authResponse));
	}

	@PostMapping("/refresh")
	public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
			@RequestBody RefreshTokenRequest refreshTokenRequest) {
		AuthResponse authResponse = authService.refreshToken(refreshTokenRequest.getRefreshToken());
		return ResponseEntity.ok(ApiResponse.success(authResponse));
	}

	@PostMapping("/logout")
	public ResponseEntity<ApiResponse<Void>> logout(@RequestBody LogoutRequest logoutRequest) {
		authService.logout(logoutRequest.getRefreshToken());
		return ResponseEntity.ok(ApiResponse.success(null));
	}
}
