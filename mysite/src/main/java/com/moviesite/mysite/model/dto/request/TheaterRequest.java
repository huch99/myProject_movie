package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterRequest {

	@NotBlank(message = "극장 이름은 필수 입력 항목입니다")
    @Size(max = 100, message = "극장 이름은 100자를 초과할 수 없습니다")
    private String name;
    
    @NotBlank(message = "지역은 필수 입력 항목입니다")
    @Size(max = 50, message = "지역은 50자를 초과할 수 없습니다")
    private String location;
    
    @NotBlank(message = "주소는 필수 입력 항목입니다")
    @Size(max = 200, message = "주소는 200자를 초과할 수 없습니다")
    private String address;
    
    private String contact;
    
    private String phone;
    
    private String facilities; // 쉼표로 구분된 문자열
    
    private String specialScreens; // 쉼표로 구분된 문자열
    
    private String imageUrl;
    
    private String description;
    
    private String features; // 쉼표로 구분된 문자열
    
    private String parking;
    
    private String transportation;
    
    private Integer capacity;
    
    private String type;
}
