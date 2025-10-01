package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterRequest {
	private String name;
    private String location;
    private String address;
    private String phone;
    private Integer totalScreens; // 스크린 정보는 별도의 요청으로 추가될 수 있으므로, 초기 생성 시에는 간단히 개수만 포함
}
