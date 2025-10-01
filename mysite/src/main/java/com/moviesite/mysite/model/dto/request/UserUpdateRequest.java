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
public class UserUpdateRequest {
	private String name;
	private String email;
	private String phone;
	private LocalDate birthDate;
	// 비밀번호 변경은 별도의 요청으로 처리하는 것이 좋습니다.
	
	// Getter 메서드
	public String getName() {
	    return name;
	}

	public String getEmail() {
	    return email;
	}

	public String getPhone() {
	    return phone;
	}

	public LocalDate getBirthDate() {
	    return birthDate;
	}

	// Setter 메서드
	public void setName(String name) {
	    this.name = name;
	}

	public void setEmail(String email) {
	    this.email = email;
	}

	public void setPhone(String phone) {
	    this.phone = phone;
	}

	public void setBirthDate(LocalDate birthDate) {
	    this.birthDate = birthDate;
	}
}
