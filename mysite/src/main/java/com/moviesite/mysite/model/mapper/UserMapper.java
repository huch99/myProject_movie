package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.RegisterRequest;
import com.moviesite.mysite.model.dto.request.UserUpdateRequest;
import com.moviesite.mysite.model.dto.response.UserResponse;
import com.moviesite.mysite.model.entity.User;

@Component
public class UserMapper {
private final PasswordEncoder passwordEncoder;
    
    public UserMapper(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setBirthDate(user.getBirthDate());
        response.setRole(user.getRole().name());
        return response;
    }
    
    public List<UserResponse> toResponseList(List<User> users) {
        return users.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public User toEntity(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setBirthDate(request.getBirthDate());
        user.setRole(User.Role.USER); // 기본 역할은 USER
        return user;
    }
    
    public void updateEntityFromRequest(User user, UserUpdateRequest request) {
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getBirthDate() != null) {
            user.setBirthDate(request.getBirthDate());
        }
    }
}
