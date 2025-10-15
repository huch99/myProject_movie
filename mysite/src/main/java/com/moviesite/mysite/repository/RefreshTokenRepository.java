package com.moviesite.mysite.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    // 토큰 값으로 RefreshToken 찾기
    Optional<RefreshToken> findByToken(String token);
    
    // 특정 사용자의 RefreshToken 찾기
    Optional<RefreshToken> findByUserEmail(String userEmail);
    
    // 만료된 토큰 찾기
    List<RefreshToken> findByExpiresAtBefore(LocalDateTime now);
    
    // 특정 사용자의 토큰 삭제
    void deleteByUserEmail(String userEmail);
    
    // 토큰 값으로 삭제
    void deleteByToken(String token);
    
    // 만료된 토큰 삭제
    void deleteByExpiresAtBefore(LocalDateTime now);
    
    // 사용자 이메일로 토큰 존재 여부 확인
    boolean existsByUserEmail(String userEmail);
}
