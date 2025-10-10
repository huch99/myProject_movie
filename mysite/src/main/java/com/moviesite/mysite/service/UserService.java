package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.UserRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.UserResponse;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;

    // 사용자 등록
    @Transactional
    public UserResponse registerUser(UserRequest userRequest) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new BadRequestException("이미 사용 중인 이메일입니다");
        }
        
        // 사용자 엔티티 생성
        User user = User.builder()
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .name(userRequest.getName())
                .nickname(userRequest.getNickname())
                .phone(userRequest.getPhone())
                .birthDate(userRequest.getBirthDate())
                .gender(userRequest.getGender() != null ? User.Gender.valueOf(userRequest.getGender()) : null)
                .profileImageUrl(userRequest.getProfileImageUrl())
                .role(User.Role.USER)
                .status(User.UserStatus.ACTIVE)
                .marketingAgree(userRequest.getMarketingAgree())
                .termsAgree(userRequest.getTermsAgree())
                .build();
        
        User savedUser = userRepository.save(user);
        return UserResponse.fromEntity(savedUser);
    }
    
    // 현재 로그인한 사용자 정보 조회
    public UserResponse getCurrentUser() {
        User user = getAuthenticatedUser();
        return UserResponse.fromEntity(user);
    }
    
    // 특정 사용자 정보 조회
    public UserResponse getUserById(Long id) {
        User user = findUserById(id);
        return UserResponse.fromEntity(user);
    }
    
    // 사용자 정보 수정
    @Transactional
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User user = findUserById(id);
        
        // 현재 로그인한 사용자가 본인 정보를 수정하는지 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin() && !user.getId().equals(currentUser.getId())) {
            throw new BadRequestException("다른 사용자의 정보를 수정할 권한이 없습니다");
        }
        
        // 이메일 변경 시 중복 확인
        if (!user.getEmail().equals(userRequest.getEmail()) && 
                userRepository.existsByEmail(userRequest.getEmail())) {
            throw new BadRequestException("이미 사용 중인 이메일입니다");
        }
        
        // 사용자 정보 업데이트
        user.setEmail(userRequest.getEmail());
        user.setName(userRequest.getName());
        user.setNickname(userRequest.getNickname());
        user.setPhone(userRequest.getPhone());
        user.setBirthDate(userRequest.getBirthDate());
        
        if (userRequest.getGender() != null) {
            user.setGender(User.Gender.valueOf(userRequest.getGender()));
        }
        
        user.setProfileImageUrl(userRequest.getProfileImageUrl());
        user.setMarketingAgree(userRequest.getMarketingAgree());
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }
    
    // 비밀번호 변경
    @Transactional
    public void changePassword(Long id, String currentPassword, String newPassword) {
        User user = findUserById(id);
        
        // 현재 로그인한 사용자가 본인 정보를 수정하는지 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin() && !user.getId().equals(currentUser.getId())) {
            throw new BadRequestException("다른 사용자의 비밀번호를 변경할 권한이 없습니다");
        }
        
        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BadRequestException("현재 비밀번호가 일치하지 않습니다");
        }
        
        // 새 비밀번호 설정
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
    }
    
    // 사용자 상태 변경 (관리자용)
    @Transactional
    public UserResponse updateUserStatus(Long id, String status) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        User user = findUserById(id);
        user.setStatus(User.UserStatus.valueOf(status));
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }
    
    // 프로필 이미지 업로드
    @Transactional
    public UserResponse uploadProfileImage(Long id, MultipartFile file) {
        User user = findUserById(id);
        
        // 현재 로그인한 사용자가 본인 정보를 수정하는지 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin() && !user.getId().equals(currentUser.getId())) {
            throw new BadRequestException("다른 사용자의 프로필 이미지를 변경할 권한이 없습니다");
        }
        
        // 기존 이미지 삭제
        if (user.getProfileImageUrl() != null) {
            fileService.deleteFile(user.getProfileImageUrl());
        }
        
        // 새 이미지 업로드
        String imageUrl = fileService.uploadProfileImage(file);
        user.setProfileImageUrl(imageUrl);
        user.setUpdatedAt(LocalDateTime.now());
        
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }
    
    // 사용자 목록 조회 (관리자용)
    public List<UserResponse> getAllUsers() {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 사용자 삭제 (관리자용)
    @Transactional
    public void deleteUser(Long id) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        User user = findUserById(id);
        userRepository.delete(user);
    }
    
    // 마지막 로그인 시간 업데이트
    @Transactional
    public void updateLastLoginTime(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    // 사용자 엔티티 조회 (내부 메서드)
    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
    
    // 현재 로그인한 사용자 조회
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}