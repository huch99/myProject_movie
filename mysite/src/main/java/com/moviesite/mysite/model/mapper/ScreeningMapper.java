package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.ScreeningRequest;
import com.moviesite.mysite.model.dto.response.ScreeningResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Screening;

@Component
public class ScreeningMapper {
	public ScreeningResponse toResponse(Screening screening) {
	    ScreeningResponse response = new ScreeningResponse();
	    response.setId(screening.getId());
	    response.setMovieId(screening.getMovie().getId());
	    response.setScreenId(screening.getScreen().getId());
	    response.setMovieTitle(screening.getMovie().getTitle());
	    response.setTheaterName(screening.getScreen().getTheater().getName());
	    response.setScreenName(screening.getScreen().getName());
	    response.setStartTime(screening.getStartTime());
	    response.setEndTime(screening.getEndTime());
	    response.setBasePrice(screening.getBasePrice());
	    return response;
	}
    
    public List<ScreeningResponse> toResponseList(List<Screening> screenings) {
        return screenings.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public Screening toEntity(ScreeningRequest request, Movie movie, Screen screen) {
        Screening screening = new Screening();
        screening.setMovie(movie);
        screening.setScreen(screen);
        screening.setStartTime(request.getStartTime());
        screening.setEndTime(request.getEndTime());
        screening.setBasePrice(request.getBasePrice());
        return screening;
    }
    
    public void updateEntityFromRequest(Screening screening, ScreeningRequest request, Movie movie, Screen screen) {
        screening.setMovie(movie);
        screening.setScreen(screen);
        screening.setStartTime(request.getStartTime());
        screening.setEndTime(request.getEndTime());
        screening.setBasePrice(request.getBasePrice());
    }
}
