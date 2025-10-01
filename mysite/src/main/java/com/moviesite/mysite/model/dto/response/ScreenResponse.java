package com.moviesite.mysite.model.dto.response;

import com.moviesite.mysite.model.entity.Screen;

public class ScreenResponse {
	private Long id;
	private String name;
	private String screenType; // Enum의 displayName을 반환하도록
	private Integer seatsRow;
	private Integer seatsColumn;
	private Integer totalSeats;
	private Long theaterId;

	public static ScreenResponse fromEntity(Screen screen) {
	    ScreenResponse response = new ScreenResponse();
	    response.setId(screen.getId());
	    response.setName(screen.getName());
	    response.setScreenType(screen.getScreenType().getDisplayName());
	    response.setSeatsRow(screen.getSeatsRow());
	    response.setSeatsColumn(screen.getSeatsColumn());
	    response.setTotalSeats(screen.getTotalSeats());
	    response.setTheaterId(screen.getTheater().getId());
	    return response;
	}
	
	// Getter 메서드
	public Long getId() {
	    return id;
	}

	public String getName() {
	    return name;
	}

	public String getScreenType() {
	    return screenType;
	}

	public Integer getSeatsRow() {
	    return seatsRow;
	}

	public Integer getSeatsColumn() {
	    return seatsColumn;
	}

	public Integer getTotalSeats() {
	    return totalSeats;
	}

	public Long getTheaterId() {
	    return theaterId;
	}

	// Setter 메서드
	public void setId(Long id) {
	    this.id = id;
	}

	public void setName(String name) {
	    this.name = name;
	}

	public void setScreenType(String screenType) {
	    this.screenType = screenType;
	}

	public void setSeatsRow(Integer seatsRow) {
	    this.seatsRow = seatsRow;
	}

	public void setSeatsColumn(Integer seatsColumn) {
	    this.seatsColumn = seatsColumn;
	}

	public void setTotalSeats(Integer totalSeats) {
	    this.totalSeats = totalSeats;
	}

	public void setTheaterId(Long theaterId) {
	    this.theaterId = theaterId;
	}
}
