package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
	 private String username;
	 private String password;
	 
	// Getter 메서드
	 public String getUsername() {
	     return username;
	 }

	 public String getPassword() {
	     return password;
	 }

	 // Setter 메서드
	 public void setUsername(String username) {
	     this.username = username;
	 }

	 public void setPassword(String password) {
	     this.password = password;
	 }
}
