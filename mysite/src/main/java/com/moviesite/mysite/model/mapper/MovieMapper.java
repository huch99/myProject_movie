package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.MovieRequest;
import com.moviesite.mysite.model.dto.response.MovieResponse;
import com.moviesite.mysite.model.entity.Movie;

@Component
public class MovieMapper {
	
	public MovieResponse toResponse(Movie movie) {
		return MovieResponse.builder()
				.id(movie.getId())
                .title(movie.getTitle())
                .titleEn(movie.getTitleEn())
                .director(movie.getDirector())
                .actors(movie.getActors())
                .genre(movie.getGenre())
                .runningTime(movie.getRunningTime())
                .releaseDate(movie.getReleaseDate())
                .endDate(movie.getEndDate())
                .rating(movie.getRating())
                .synopsis(movie.getSynopsis())
                .posterUrl(movie.getPosterUrl())
                .backgroundUrl(movie.getBackgroundUrl())
                .trailerUrl(movie.getTrailerUrl())
                .status(movie.getStatus())
                .build();
	}
	
	public List<MovieResponse> toResponseList(List<Movie> movies) {
        return movies.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
	public Movie toEntity(MovieRequest request) {
	    Movie movie = new Movie();
	    movie.setTitle(request.getTitle());
	    movie.setTitleEn(request.getTitleEn());
	    movie.setDirector(request.getDirector());
	    movie.setActors(request.getActors());
	    movie.setGenre(request.getGenre());
	    movie.setRunningTime(request.getRunningTime());
	    movie.setReleaseDate(request.getReleaseDate());
	    movie.setEndDate(request.getEndDate());
	    movie.setRating(request.getRating());
	    movie.setSynopsis(request.getSynopsis());
	    movie.setPosterUrl(request.getPosterUrl());
	    movie.setBackgroundUrl(request.getBackgroundUrl());
	    movie.setTrailerUrl(request.getTrailerUrl());
	    movie.setStatus(request.getStatus());
	    return movie;
	}
    
    public void updateEntityFromRequest(Movie movie, MovieRequest request) {
        movie.setTitle(request.getTitle());
        movie.setTitleEn(request.getTitleEn());
        movie.setDirector(request.getDirector());
        movie.setActors(request.getActors());
        movie.setGenre(request.getGenre());
        movie.setRunningTime(request.getRunningTime());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setEndDate(request.getEndDate());
        movie.setRating(request.getRating());
        movie.setSynopsis(request.getSynopsis());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setBackgroundUrl(request.getBackgroundUrl());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setStatus(request.getStatus());
    }
}
