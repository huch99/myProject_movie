package com.moviesite.mysite.model.dto.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.moviesite.mysite.model.entity.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    @JsonProperty(value = "password", access = JsonProperty.Access.WRITE_ONLY)
    private String password;
    private String name;
    private String phone;
    private LocalDate birthDate;
    private Boolean marketingAgree;
    private Boolean termsAgree;
    private String nickname;
//  private User.Gender gender;
    
}
