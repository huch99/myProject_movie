package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.User.UserStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	// 이메일로 사용자 조회
    Optional<User> findByEmail(String email);
    
    // 이름으로 사용자 조회
    List<User> findByName(String name);
    
    // 닉네임으로 사용자 조회
    Optional<User> findByNickname(String nickname);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 닉네임 존재 여부 확인
    boolean existsByNickname(String nickname);
    
    // 특정 상태의 사용자 목록 조회
    List<User> findByStatus(User.UserStatus status);
    
    // 특정 역할의 사용자 목록 조회
    List<User> findByRole(User.Role role);
    
    // 특정 기간에 가입한 사용자 목록 조회
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    // 특정 기간 이후에 로그인한 사용자 목록 조회
    List<User> findByLastLoginAtAfter(LocalDateTime lastLoginTime);
    
    // 이름 또는 닉네임으로 사용자 검색 (페이징 처리)
    Page<User> findByNameContainingOrNicknameContaining(String name, String nickname, Pageable pageable);
    
    // 특정 생년월일 이후 출생한 사용자 목록 조회
    List<User> findByBirthDateAfter(LocalDate birthDate);
    
    // 마케팅 동의한 사용자 목록 조회
    List<User> findByMarketingAgreeTrue();
    
    // 최근 가입한 사용자 목록 조회
    @Query("SELECT u FROM User u ORDER BY u.createdAt DESC")
    List<User> findRecentUsers(Pageable pageable);
    
    // 특정 기간 동안 비활성 상태인 사용자 목록 조회
    @Query("SELECT u FROM User u WHERE u.lastLoginAt < :date AND u.status = 'ACTIVE'")
    List<User> findInactiveUsers(@Param("date") LocalDateTime date);
    
    // 사용자 수 통계 (상태별)
    @Query("SELECT u.status, COUNT(u) FROM User u GROUP BY u.status")
    List<Object[]> countByStatus();
    
    // 사용자 수 통계 (역할별)
    @Query("SELECT u.role, COUNT(u) FROM User u GROUP BY u.role")
    List<Object[]> countByRole();
    
    // 사용자 수 통계 (월별 가입자)
    @Query("SELECT FUNCTION('YEAR', u.createdAt), FUNCTION('MONTH', u.createdAt), COUNT(u) " +
           "FROM User u GROUP BY FUNCTION('YEAR', u.createdAt), FUNCTION('MONTH', u.createdAt) " +
           "ORDER BY FUNCTION('YEAR', u.createdAt) DESC, FUNCTION('MONTH', u.createdAt) DESC")
    List<Object[]> countByMonthlyRegistration();


}
