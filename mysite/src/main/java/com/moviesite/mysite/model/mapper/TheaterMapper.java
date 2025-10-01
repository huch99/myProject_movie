package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.TheaterRequest;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.model.entity.Theater;

@Component
public class TheaterMapper {
	
private final ScreenMapper screenMapper;
    
    public TheaterMapper(ScreenMapper screenMapper) {
        this.screenMapper = screenMapper;
    }
    
    public TheaterResponse toResponse(Theater theater) {
        TheaterResponse response = new TheaterResponse();
        response.setId(theater.getId());
        response.setName(theater.getName());
        response.setLocation(theater.getLocation());
        response.setAddress(theater.getAddress());
        response.setPhone(theater.getPhone());
        response.setTotalScreens(theater.getTotalScreens());
        
        if (theater.getScreens() != null && !theater.getScreens().isEmpty()) {
            response.setScreens(screenMapper.toResponseList(theater.getScreens()));
        }
        
        return response;
    }
    
    public List<TheaterResponse> toResponseList(List<Theater> theaters) {
        return theaters.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public Theater toEntity(TheaterRequest request) {
        Theater theater = new Theater();
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setAddress(request.getAddress());
        theater.setPhone(request.getPhone());
        theater.setTotalScreens(request.getTotalScreens());
        return theater;
    }
    
    public void updateEntityFromRequest(Theater theater, TheaterRequest request) {
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setAddress(request.getAddress());
        theater.setPhone(request.getPhone());
        theater.setTotalScreens(request.getTotalScreens());
    }
}
