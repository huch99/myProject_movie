package com.moviesite.mysite.model.dto.response;

import com.moviesite.mysite.model.entity.Theater;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterResponse {

	private Long theaterId;
	private String name;
	private String location;
	private String address;
	private String contact;
	private String phone;
	private List<String> facilities;
	private List<String> specialScreens;
	private String imageUrl;
	private String description;
	private List<String> features;
	private String parking;
	private String transportation;
	private Integer capacity;
	private String type;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String formattedCreatedAt;

	// 상영관 정보 (필요한 경우)
	private List<ScreenSummaryResponse> screens;

	// Entity -> DTO 변환 메서드
	public static TheaterResponse fromEntity(Theater theater) {
		if (theater == null) {
			return null;
		}

		return TheaterResponse.builder().theaterId(theater.getId()).name(theater.getName())
				.location(theater.getLocation()).address(theater.getAddress()).contact(theater.getContact())
				.phone(theater.getPhone()).facilities(theater.getFacilitiesList())
				.specialScreens(theater.getSpecialScreensList()).imageUrl(theater.getImageUrl())
				.description(theater.getDescription()).features(theater.getFeaturesList()).parking(theater.getParking())
				.transportation(theater.getTransportation()).capacity(theater.getCapacity()).type(theater.getType())
				.createdAt(theater.getCreatedAt()).updatedAt(theater.getUpdatedAt())
				.formattedCreatedAt(theater.getCreatedAt() != null
						? theater.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"))
						: null)
				.build();
	}

	// 상영관 요약 정보를 담는 내부 클래스
	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class ScreenSummaryResponse {
		private Long screenId;
		private String name;
		private Integer capacity;
		private String screenType;
	}
}
