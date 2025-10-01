package com.moviesite.mysite.model.dto.response;

import java.time.LocalDate;

import com.moviesite.mysite.model.entity.User;

public class UserResponse {
	private Long id;
    private String username;
    private String email;
    private String name;
    private String phone;
    private LocalDate birthDate;
    private String role;

    public static UserResponse fromEntity(User user) {
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
    
 // Getter 메서드
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getRole() {
        return role;
    }

    // Setter 메서드
    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
