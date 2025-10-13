package com.moviesite.mysite.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
public class JwtConfig {
	
	@Value("${jwt.secret.key}")
    private String secret;

    // Access Token 유효 기간
    @Value("${jwt.expiration.ms}") // Huch님 설정명으로 변경
    private Long accessTokenValidity; // 변수명도 명확하게 변경

    // 리프레시 토큰 유효 기간
    @Value("${jwt.refresh.expiration.ms}") // Huch님 설정명으로 변경
    private Long refreshTokenValidity; // 변수명도 명확하게 변경
    
    // --- 아래는 제가 이전 JwtConfig에 추가했던 부분으로, Huch님의 설정 파일에 추가해주셔야 합니다. ---
    @Value("${jwt.header:Authorization}") // 기본값 부여
    private String header;

    @Value("${jwt.token-prefix:Bearer }") // 기본값 부여 (공백 포함)
    private String tokenPrefix;

    @Value("${jwt.issuer:movie-booking-app}") // 기본값 부여
    private String issuer;
    
    // 토큰 타입 (상수)
    public static final String TOKEN_TYPE = "Bearer";
    
    // 권한 클레임 이름 (상수)
    public static final String AUTHORITIES_KEY = "auth";
    
    // 사용자 ID 클레임 이름 (상수)
    public static final String USER_ID_KEY = "userId";
    
    // 토큰 생성 시간 클레임 (상수)
    public static final String TOKEN_CREATED_DATE = "created";
}
