package com.moviesite.mysite.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
	 @Value("${jwt.secret}")
	    private String secret;

	    @Value("${jwt.access-token-validity}")
	    private long accessTokenValidity;

	    @Value("${jwt.refresh-token-validity}")
	    private long refreshTokenValidity;

	    // JWT 토큰에서 사용자 이름 추출
	    public String extractUsername(String token) {
	        return extractClaim(token, Claims::getSubject);
	    }

	    // JWT 토큰에서 만료 일자 추출
	    public Date extractExpiration(String token) {
	        return extractClaim(token, Claims::getExpiration);
	    }

	    // JWT 토큰에서 역할 추출
	    public String extractRole(String token) {
	        final Claims claims = extractAllClaims(token);
	        return claims.get("role", String.class);
	    }

	    // JWT 토큰에서 특정 클레임 추출
	    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
	        final Claims claims = extractAllClaims(token);
	        return claimsResolver.apply(claims);
	    }

	    // JWT 토큰에서 모든 클레임 추출
	    private Claims extractAllClaims(String token) {
	        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	        return Jwts.parserBuilder()
	                .setSigningKey(key)
	                .build()
	                .parseClaimsJws(token)
	                .getBody();
	    }
	    
	 // 토큰이 만료되었는지 확인
	    private Boolean isTokenExpired(String token) {
	        return extractExpiration(token).before(new Date());
	    }

	    // 액세스 토큰 생성
	    public String generateAccessToken(String username, String role) {
	        Map<String, Object> claims = new HashMap<>();
	        claims.put("role", role);
	        return createToken(claims, username, accessTokenValidity);
	    }

	    // 리프레시 토큰 생성
	    public String generateRefreshToken(String username) {
	        return createToken(new HashMap<>(), username, refreshTokenValidity);
	    }

	    // 토큰 생성 공통 메서드
	    private String createToken(Map<String, Object> claims, String subject, long validityInMilliseconds) {
	        Date now = new Date();
	        Date validity = new Date(now.getTime() + validityInMilliseconds);

	        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));

	        return Jwts.builder()
	                .setClaims(claims)
	                .setSubject(subject)
	                .setIssuedAt(now)
	                .setExpiration(validity)
	                .signWith(key, SignatureAlgorithm.HS256)
	                .compact();
	    }

	    // 토큰 유효성 검증
	    public Boolean validateToken(String token) {
	        try {
	            return !isTokenExpired(token);
	        } catch (Exception e) {
	            return false;
	        }
	    }

	    // 사용자 정보와 토큰 일치 여부 확인
	    public Boolean validateToken(String token, UserDetails userDetails) {
	        final String username = extractUsername(token);
	        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
	    }
}
