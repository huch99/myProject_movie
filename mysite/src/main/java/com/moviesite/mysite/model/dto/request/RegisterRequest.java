package com.moviesite.mysite.model.dto.request;

import java.time.LocalDate;

import com.moviesite.mysite.model.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
    private LocalDate birthDate;
    private User.Gender gender;
    private Boolean marketingAgree;
}
