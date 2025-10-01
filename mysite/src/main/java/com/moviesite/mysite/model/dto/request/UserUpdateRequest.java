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
}
