package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
	 private String username;
	 private String email;
	 private String password;
	 private String name;
	 private String phone;
	 private LocalDate birthDate;
	 // 초기 회원 가입 시 역할은 'USER'로 고정하거나 관리자가 부여
}
