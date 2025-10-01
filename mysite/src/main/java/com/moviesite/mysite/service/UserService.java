package com.moviesite.mysite.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.UserUpdateRequest;
import com.moviesite.mysite.model.dto.response.UserResponse;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.User.Role;
import com.moviesite.mysite.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	@Autowired
	private UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        // 본인 정보만 조회 가능하도록 권한 확인 필요
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!user.getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to view this user's information.");
        }
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!user.getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to update this user's information.");
        }

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use.");
        }

        user.setName(request.getName() != null ? request.getName() : user.getName());
        user.setEmail(request.getEmail() != null ? request.getEmail() : user.getEmail());
        user.setPhone(request.getPhone() != null ? request.getPhone() : user.getPhone());
        user.setBirthDate(request.getBirthDate() != null ? request.getBirthDate() : user.getBirthDate());
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        return UserResponse.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        // 자신의 계정 삭제는 허용 (추가 확인 절차 필요) or ADMIN만 삭제 허용
        if (!user.getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to delete this user.");
        }
        // TODO: 계정 삭제 시 관련 데이터 (예매, 리뷰 등) 처리 로직 필요 (CASCADE 설정 또는 수동 삭제)
        userRepository.deleteById(id);
    }
    
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        try {
            Role role = Role.valueOf(newRole.toUpperCase());
            user.setRole(role);
            user.setUpdatedAt(LocalDateTime.now());
            User updatedUser = userRepository.save(user);
            return UserResponse.fromEntity(updatedUser);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified: " + newRole);
        }
    }
    
}
