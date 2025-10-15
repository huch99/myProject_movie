package com.moviesite.mysite.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.moviesite.mysite.model.dto.request.LoginRequest;
import com.moviesite.mysite.model.dto.request.RegisterRequest;
import com.moviesite.mysite.model.dto.response.AuthResponse;
import com.moviesite.mysite.model.entity.RefreshToken;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.RefreshTokenRepository;
import com.moviesite.mysite.repository.UserRepository;
import com.moviesite.mysite.security.JwtTokenProvider;

@Service
public class AuthService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Autowired
	private RefreshTokenRepository refreshTokenRepository;
	
	private void saveRefreshToken(String userEmail, String token) {
	    // 토큰 만료 시간 계산
	    LocalDateTime expiresAt = LocalDateTime.now()
	        .plusSeconds(jwtTokenProvider.getRefreshTokenValidityInSeconds());
	    
	    // 기존 토큰이 있는지 확인
	    Optional<RefreshToken> existingToken = refreshTokenRepository.findByUserEmail(userEmail);
	    
	    if (existingToken.isPresent()) {
	        // 기존 토큰이 있으면 업데이트
	        RefreshToken refreshToken = existingToken.get();
	        refreshToken.setToken(token);
	        refreshToken.setExpiresAt(expiresAt);
	        refreshTokenRepository.save(refreshToken);
	    } else {
	        // 새 토큰 생성
	        RefreshToken refreshToken = RefreshToken.builder()
	            .token(token)
	            .userEmail(userEmail)
	            .expiresAt(expiresAt)
	            .build();
	        refreshTokenRepository.save(refreshToken);
	    }
	}
	
	public AuthResponse login(LoginRequest loginRequest) {
        // 사용자 검증 및 토큰 생성 로직
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        
        String accessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
        
        // RefreshToken 저장
        saveRefreshToken(user.getEmail(), refreshToken);
        
        return new AuthResponse(accessToken, refreshToken, user.getEmail(), user.getName(), user.getRole().name());
    }
    
    public AuthResponse register(RegisterRequest registerRequest) {
        // 사용자 등록 및 토큰 생성 로직
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("이미 등록된 이메일입니다.");
        }
        
        User user = User.builder()
            .email(registerRequest.getEmail())
            .password(passwordEncoder.encode(registerRequest.getPassword()))
            .name(registerRequest.getName())
            .role(User.Role.USER)
            .status(User.UserStatus.ACTIVE)
            .termsAgree(true)
            .build();
        
        userRepository.save(user);
        
        String accessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
        
        // RefreshToken 저장
        saveRefreshToken(user.getEmail(), refreshToken);
        
        return new AuthResponse(accessToken, refreshToken, user.getEmail(), user.getName(), user.getRole().name());
    }
    
    public void logout(String refreshToken) {
        // 리프레시 토큰 검증
        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new RuntimeException("유효하지 않은 리프레시 토큰입니다."));
        
        // 토큰 삭제
        refreshTokenRepository.delete(tokenEntity);
        
        // 또는 deleteByToken 메서드를 사용할 수도 있습니다
        // refreshTokenRepository.deleteByToken(refreshToken);
    }
    
    public AuthResponse refreshToken(String refreshToken) {
        // 1. 리프레시 토큰 유효성 검증
        RefreshToken tokenEntity = refreshTokenRepository.findByToken(refreshToken)
            .orElseThrow(() -> new RuntimeException("유효하지 않은 리프레시 토큰입니다."));
        
        // 2. 토큰 만료 확인
        if (tokenEntity.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(tokenEntity);
            throw new RuntimeException("만료된 리프레시 토큰입니다. 다시 로그인해주세요.");
        }
        
        // 3. 사용자 정보 조회
        User user = userRepository.findByEmail(tokenEntity.getUserEmail())
            .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));
        
        // 4. 새로운 액세스 토큰 발급
        String newAccessToken = jwtTokenProvider.createAccessToken(user.getEmail(), user.getRole().name());
        
        // 5. 필요에 따라 리프레시 토큰도 갱신 (선택사항)
        // String newRefreshToken = jwtTokenProvider.createRefreshToken(user.getEmail());
        // jwtTokenProvider.saveRefreshToken(user.getEmail(), newRefreshToken);
        
        // 6. 응답 생성 (리프레시 토큰은 갱신하지 않는 경우)
        return new AuthResponse(
            newAccessToken,
            refreshToken, // 기존 리프레시 토큰 유지
            user.getEmail(),
            user.getName(),
            user.getRole().name()
        );
    }
}
