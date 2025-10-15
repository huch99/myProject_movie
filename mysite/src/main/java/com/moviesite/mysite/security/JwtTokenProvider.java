package com.moviesite.mysite.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.entity.RefreshToken;
import com.moviesite.mysite.repository.RefreshTokenRepository;

import jakarta.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Component
public class JwtTokenProvider {

	private final long accessTokenValidityInMilliseconds;
	private final long refreshTokenValidityInMilliseconds;
	private final RefreshTokenRepository refreshTokenRepository;

	@Value("${jwt.secret.key}")
	private String secretKey;

	@Value("${jwt.expiration.ms}")
	private long tokenValidityInSeconds;

	private SecretKey key;

	@PostConstruct
	protected void init() {
		this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
	}

	// 토큰 생성
	public String createToken(Authentication authentication) {
		String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(","));

		long now = (new Date()).getTime();
		Date validity = new Date(now + this.tokenValidityInSeconds * 1000);

		return Jwts.builder().setSubject(authentication.getName()).claim("auth", authorities).setIssuedAt(new Date())
				.setExpiration(validity).signWith(key).compact();
	}

	// 토큰에서 인증 정보 추출
	public Authentication getAuthentication(String token) {
		Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();

		Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
				.map(SimpleGrantedAuthority::new).collect(Collectors.toList());

		User principal = new User(claims.getSubject(), "", authorities);

		return new UsernamePasswordAuthenticationToken(principal, token, authorities);
	}

	// 토큰 유효성 검증
	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			log.info("유효하지 않은 JWT 토큰입니다.");
			return false;
		}
	}

	// 토큰에서 사용자 ID 추출
	public String getUserId(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
	}

	@Autowired
    public JwtTokenProvider(RefreshTokenRepository refreshTokenRepository,
                           @Value("${jwt.secret.key}") String secretKey,
                           @Value("${jwt.expiration.ms}") long tokenValidityInSeconds) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.accessTokenValidityInMilliseconds = tokenValidityInSeconds;
        this.refreshTokenValidityInMilliseconds = tokenValidityInSeconds * 7; // 리프레시 토큰은 7배 길게 설정
        
        // 시크릿 키 초기화
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

	public String createAccessToken(String email, String role) {
		// 토큰 만료 시간 설정 (예: 30분)
		Date now = new Date();
		Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

		// JWT 토큰 생성
		return Jwts.builder().setSubject(email) // 토큰 제목 (사용자 식별값)
				.claim("auth", role) // 사용자 권한 정보
				.setIssuedAt(now) // 토큰 발행 시간
				.setExpiration(validity) // 토큰 만료 시간
				.signWith(key, SignatureAlgorithm.HS512) // 서명 알고리즘과 키 설정
				.compact();
	}

	public String createRefreshToken(String email) {
		// 토큰 만료 시간 설정 (예: 7일)
		Date now = new Date();
		Date validity = new Date(now.getTime() + refreshTokenValidityInMilliseconds);

		// JWT 리프레시 토큰 생성 (클레임은 최소화)
		return Jwts.builder().setSubject(email) // 토큰 제목 (사용자 식별값)
				.setIssuedAt(now) // 토큰 발행 시간
				.setExpiration(validity) // 토큰 만료 시간
				.signWith(key, SignatureAlgorithm.HS512) // 서명 알고리즘과 키 설정
				.compact();
	}
	
	public long getRefreshTokenValidityInSeconds() {
	    return refreshTokenValidityInMilliseconds / 1000;
	}
}
