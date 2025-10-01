package com.moviesite.mysite.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import com.moviesite.mysite.model.entity.Theater;
import com.moviesite.mysite.model.entity.Screen;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterResponse {
	private Long id;
	private String name;
	private String location;
	private String address;
	private String phone;
	private Integer totalScreens;
	private List<ScreenResponse> screens; // 상세 조회 시 스크린 정보 포함

	public static TheaterResponse fromEntity(Theater theater) {
	    List<ScreenResponse> screenResponses = null;
	    if (theater.getScreens() != null && !theater.getScreens().isEmpty()) {
	        screenResponses = theater.getScreens().stream()
	                .map(ScreenResponse::fromEntity)
	                .collect(Collectors.toList());
	    }

	    TheaterResponse response = new TheaterResponse();
	    response.setId(theater.getId());
	    response.setName(theater.getName());
	    response.setLocation(theater.getLocation());
	    response.setAddress(theater.getAddress());
	    response.setPhone(theater.getPhone());
	    response.setTotalScreens(theater.getTotalScreens());
	    response.setScreens(screenResponses);
	    return response;
	}
	
	// Getter 메서드
	public Long getId() {
	    return id;
	}

	public String getName() {
	    return name;
	}

	public String getLocation() {
	    return location;
	}

	public String getAddress() {
	    return address;
	}

	public String getPhone() {
	    return phone;
	}

	public Integer getTotalScreens() {
	    return totalScreens;
	}

	public List<ScreenResponse> getScreens() {
	    return screens;
	}

	// Setter 메서드
	public void setId(Long id) {
	    this.id = id;
	}

	public void setName(String name) {
	    this.name = name;
	}

	public void setLocation(String location) {
	    this.location = location;
	}

	public void setAddress(String address) {
	    this.address = address;
	}

	public void setPhone(String phone) {
	    this.phone = phone;
	}

	public void setTotalScreens(Integer totalScreens) {
	    this.totalScreens = totalScreens;
	}

	public void setScreens(List<ScreenResponse> screens) {
	    this.screens = screens;
	}
}
