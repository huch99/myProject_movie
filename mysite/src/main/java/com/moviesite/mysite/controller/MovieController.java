package com.moviesite.mysite.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.MovieRequest;
import com.moviesite.mysite.model.dto.response.MovieResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.service.MovieService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MovieController {
	
	@Autowired
	private MovieService movieService;
	
	@GetMapping
	public ResponseEntity<List<MovieResponse>> getAllMovies(
			@RequestParam(required = false) Movie.MovieStatus status) {
		List<MovieResponse> movies;
		if (status != null) {
			movies = movieService.getMoviesByStatus(status);
		} else {
			movies = movieService.getAllMovies();
		}
		return ResponseEntity.ok(movies);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<MovieResponse> getMovieById(@PathVariable Long id) {
		MovieResponse movie = movieService.getMovieById(id);
		return ResponseEntity.ok(movie);
	}
	
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MovieResponse> createMovie(@RequestBody MovieRequest movieRequest) {
		MovieResponse createdMovie = movieService.createMovie(movieRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdMovie);
	}
	
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<MovieResponse> updateMove(
			@PathVariable Long id,
			@RequestBody MovieRequest movieRequest) {
		MovieResponse updatedMovie = movieService.updateMovie(id, movieRequest);
		return ResponseEntity.ok(updatedMovie);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<MovieResponse>> searchMovies(
            @RequestParam String keyword) {
        List<MovieResponse> movies = movieService.searchMovies(keyword);
        return ResponseEntity.ok(movies);
    }
	
	@GetMapping("/upcoming")
    public ResponseEntity<List<MovieResponse>> getUpcomingMovies() {
        List<MovieResponse> movies = movieService.getMoviesByStatus(Movie.MovieStatus.COMING_SOON);
        return ResponseEntity.ok(movies);
    }
    
    @GetMapping("/now-showing")
    public ResponseEntity<List<MovieResponse>> getNowShowingMovies() {
        List<MovieResponse> movies = movieService.getMoviesByStatus(Movie.MovieStatus.NOW_SHOWING);
        return ResponseEntity.ok(movies);
    }
}
