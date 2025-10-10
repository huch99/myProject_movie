package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    
    private Long userId;
    private String email;
    private String name;
    private String nickname;
    private String phone;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;
    
    private String gender;
    private String profileImageUrl;
    private String role;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastLoginAt;
    
    private String formattedLastLoginAt;
    private Boolean marketingAgree;
    private Boolean termsAgree;
    private LocalDateTime createdAt;
    private String formattedCreatedAt;
    
    // Entity -> DTO 변환 메서드
    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        
        return UserResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .nickname(user.getNickname())
                .phone(user.getPhone())
                .birthDate(user.getBirthDate())
                .gender(user.getGender() != null ? user.getGender().name() : null)
                .profileImageUrl(user.getProfileImageUrl())
                .role(user.getRole().name())
                .status(user.getStatus().name())
                .lastLoginAt(user.getLastLoginAt())
                .formattedLastLoginAt(user.getLastLoginAt() != null ?
                        user.getLastLoginAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .marketingAgree(user.getMarketingAgree())
                .termsAgree(user.getTermsAgree())
                .createdAt(user.getCreatedAt())
                .formattedCreatedAt(user.getCreatedAt() != null ?
                        user.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .build();
    }
}