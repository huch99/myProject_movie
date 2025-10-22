package com.moviesite.mysite.config;

import lombok.Getter;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Configuration
@Getter
public class JwtConfig {
	
	@Value("${jwt.secret.key}")
    private String secret;
	
	private SecretKey signingKey;

    // Access Token 유효 기간
    @Value("${jwt.expiration.ms}") 
    private Long accessTokenValidity;

    // 리프레시 토큰 유효 기간
    @Value("${jwt.refresh.expiration.ms}")
    private Long refreshTokenValidity;
    
    @Value("${jwt.header:Authorization}") 
    private String header;

    @Value("${jwt.token-prefix:Bearer }")
    private String tokenPrefix;

    @Value("${jwt.issuer:movie-booking-app}")
    private String issuer;
    
    // 토큰 타입 (상수)
    public static final String TOKEN_TYPE = "Bearer";
    
    // 권한 클레임 이름 (상수)
    public static final String AUTHORITIES_KEY = "auth";
    
    // 사용자 ID 클레임 이름 (상수)
    public static final String USER_ID_KEY = "userId";
    
    // 토큰 생성 시간 클레임 (상수)
    public static final String TOKEN_CREATED_DATE = "created";
    
 // 생성자에서 secret 값을 주입받아 SecretKey를 초기화합니다.
    public JwtConfig(@Value("${jwt.secret.key}") String secret) {
        this.secret = secret; // secret 필드에도 값 저장
        // Base64 디코딩된 바이트 배열로 키를 생성
        byte[] keyBytes = Decoders.BASE64.decode(secret); 
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }
    
    // 이 메서드를 통해 SecretKey를 제공합니다.
    public SecretKey getSigningKey() {
        return signingKey;
    }
}
