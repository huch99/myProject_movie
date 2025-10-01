package com.moviesite.mysite.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.AuthenticationException;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.model.dto.request.LoginRequest;
import com.moviesite.mysite.model.dto.request.RegisterRequest;
import com.moviesite.mysite.model.dto.response.AuthResponse;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.User.Role;
import com.moviesite.mysite.repository.UserRepository;
import com.moviesite.mysite.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	@Autowired
	private UserRepository userRepository;
	private PasswordEncoder passwordEncoder;
	private JwtUtil jwtUtil;
	
	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if(userRepository.existsByUsername(request.getUsername())) {
			throw new BadRequestException("Username already exists.");
		}
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new BadRequestException("Email already exists.");
		}
		
		User user = user.builder()
				.username(request.getUsername())
				.email(request.getEmail())
				.password(passwordEncoder.encode(request.getPassword()))
				.name(request.getName())
				.phone(request.getPhone())
				.birthDate(request.getBirthDate())
				.role(Role.USER)
				.createdAt(LocalDateTime.now())
				.updatedAt(LocalDateTime.now())
				.build();
		userRepository.save(user);
		
		String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());
		String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
		
		return AuthResponse.builder()
				.accessToken(accessToken)
				.refreshToken(refreshToken)
				.userId(user.getId())
				.username(user.getUsername())
				.role(user.getRole().name())
				.build();
	}
	
	public AuthResponse login(LoginRequest request) {
		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new AuthenticationException("Invalid username or password."));
		
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new AuthenticationException("Invalid username or password.");
		}
		
		String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());
		String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
		
		return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
	}
	
	public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new AuthenticationException("Invalid or expired refresh token.");
        }
        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AuthenticationException("User not found for refresh token."));

        String newAccessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getRole().name());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getUsername()); // 리프레시 토큰도 재발급

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }
}
