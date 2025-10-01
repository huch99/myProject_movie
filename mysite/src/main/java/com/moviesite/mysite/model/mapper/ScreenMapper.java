package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.ScreenRequest;
import com.moviesite.mysite.model.dto.request.ScreeningRequest;
import com.moviesite.mysite.model.dto.response.ScreenResponse;
import com.moviesite.mysite.model.entity.Screen;

@Component
public class ScreenMapper {
	
	public ScreenResponse toResponse(Screen screen) {
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

	public List<ScreenResponse> toResponseList(List<Screen> screens) {
	    return screens.stream()
	            .map(this::toResponse)
	            .collect(Collectors.toList());
	}

	public Screen toEntity(ScreenRequest request) {
	    Screen screen = new Screen();
	    screen.setName(request.getName());
	    screen.setScreenType(Screen.ScreenType.valueOf(request.getScreenType()));
	    screen.setSeatsRow(request.getSeatsRow());
	    screen.setSeatsColumn(request.getSeatsColumn());
	    screen.setTotalSeats(request.getSeatsRow() * request.getSeatsColumn());
	    return screen;
	}
}
