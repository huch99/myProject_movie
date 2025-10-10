package com.moviesite.mysite.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    private String nickname;
    
    private String phone;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Enumerated(EnumType.STRING)
    private Gender gender;
    
    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "marketing_agree")
    private Boolean marketingAgree;
    
    @Column(name = "terms_agree", nullable = false)
    private Boolean termsAgree;
    
    // 성별 열거형
    public enum Gender {
        MALE, FEMALE, OTHER
    }
    
    // 사용자 권한 열거형
    public enum Role {
        USER, ADMIN
    }
    
    // 사용자 상태 열거형
    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = Role.USER;
        }
        if (this.status == null) {
            this.status = UserStatus.ACTIVE;
        }
        if (this.marketingAgree == null) {
            this.marketingAgree = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 편의 메서드: 관리자 여부 확인
    @Transient
    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }
    
    // 편의 메서드: 활성 계정 여부 확인
    @Transient
    public boolean isActive() {
        return this.status == UserStatus.ACTIVE;
    }
}
