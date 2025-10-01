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
	 
	// Getter 메서드
	 public String getUsername() {
	     return username;
	 }

	 public String getEmail() {
	     return email;
	 }

	 public String getPassword() {
	     return password;
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

	 // Setter 메서드
	 public void setUsername(String username) {
	     this.username = username;
	 }

	 public void setEmail(String email) {
	     this.email = email;
	 }

	 public void setPassword(String password) {
	     this.password = password;
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
}
