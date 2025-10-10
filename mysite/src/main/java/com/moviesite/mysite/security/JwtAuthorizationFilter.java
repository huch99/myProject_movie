package com.moviesite.mysite.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.util.JwtUtil;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper;
    
    // 인증이 필요 없는 URL 패턴 목록
    private static final List<String> EXCLUDE_URL = Arrays.asList(
            "/api/auth/login",
            "/api/auth/register",
            "/api/auth/refresh",
            "/api/movies",
            "/api/theaters",
            "/api/health"
    );
    
    public JwtAuthorizationFilter() {
        this.jwtUtil = null;
        this.userDetailsService = null;
        this.objectMapper = new ObjectMapper();
    }
    
    

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return EXCLUDE_URL.stream()
                .anyMatch(exclude -> request.getServletPath().startsWith(exclude));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        try {
            // Authorization 헤더에서 JWT 토큰 추출
            final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
            
            // 토큰이 없거나 Bearer 형식이 아닌 경우 다음 필터로 진행
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }
            
            // Bearer 접두사 제거하여 순수 토큰 추출
            final String token = authHeader.substring(7);
            final String username = jwtUtil.extractUsername(token);
            
            // 토큰에서 추출한 사용자명이 있고, 현재 인증 정보가 없는 경우
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 토큰 유효성 검증
                if (jwtUtil.validateToken(token, userDetails)) {
                    // 인증 정보 생성
                    UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            
            // 다음 필터로 진행
            filterChain.doFilter(request, response);
            
        } catch (Exception e) {
            log.error("JWT 인증 처리 중 오류 발생: {}", e.getMessage());
            setErrorResponse(response, e);
        }
    }
    
    // 에러 응답 설정
    private void setErrorResponse(HttpServletResponse response, Exception e) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        
        ApiResponse<Object> errorResponse = ApiResponse.error("인증에 실패했습니다. 다시 로그인해주세요."+ e.getMessage());
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
    
    public JwtAuthorizationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = null; // 필요한 경우 별도로 설정해야 함
        this.objectMapper = new ObjectMapper();
    }
}