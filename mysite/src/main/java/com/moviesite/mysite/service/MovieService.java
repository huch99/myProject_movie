package com.moviesite.mysite.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.MovieRequest;
import com.moviesite.mysite.model.dto.response.MovieResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {
	@Autowired
	private MovieRepository movieRepository;

	@Transactional(readOnly = true)
	public List<MovieResponse> getAllMovies() {
		return movieRepository.findAll().stream()
				.map((Movie movie) -> new MovieResponse(movie.getId(), movie.getTitle(), movie.getTitleEn(),
						movie.getDirector(), movie.getActors(), movie.getGenre(), movie.getRunningTime(),
						movie.getReleaseDate(), movie.getEndDate(), movie.getRating(), movie.getSynopsis(),
						movie.getPosterUrl(), movie.getBackgroundUrl(), movie.getTrailerUrl(), movie.getStatus()))
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public MovieResponse getMovieById(Long id) {
		Movie movie = movieRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
		return MovieResponse.builder().id(movie.getId()).title(movie.getTitle()).titleEn(movie.getTitleEn())
				.director(movie.getDirector()).actors(movie.getActors()).genre(movie.getGenre())
				.runningTime(movie.getRunningTime()).releaseDate(movie.getReleaseDate()).endDate(movie.getEndDate())
				.rating(movie.getRating()).synopsis(movie.getSynopsis()).posterUrl(movie.getPosterUrl())
				.backgroundUrl(movie.getBackgroundUrl()).trailerUrl(movie.getTrailerUrl()).status(movie.getStatus())
				.build();
	}

	@Transactional
	public MovieResponse createMovie(MovieRequest request) {
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
		movie.setStatus(request.getStatus() != null ? request.getStatus() : Movie.MovieStatus.COMING_SOON);

		Movie savedMovie = movieRepository.save(movie);
		return getMovieById(savedMovie.getId());
	}

	@Transactional
	public MovieResponse updateMovie(Long id, MovieRequest request) {
		Movie movie = movieRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));

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
		if (request.getStatus() != null) {
			movie.setStatus(request.getStatus());
		}
		movie.setUpdatedAt(LocalDateTime.now());
		Movie updatedMovie = movieRepository.save(movie);
		return getMovieById(updatedMovie.getId());
	}

	@Transactional
	public void deleteMovie(Long id) {
		movieRepository.deleteById(id);
	}

	@Transactional(readOnly = true)
	public List<MovieResponse> getMoviesByStatus(Movie.MovieStatus status) {
		return movieRepository.findByStatus(status).stream()
				.map(movie -> MovieResponse.builder().id(movie.getId()).title(movie.getTitle())
						.posterUrl(movie.getPosterUrl()).status(movie.getStatus()).build()) // 간단한 정보만 반환
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public List<MovieResponse> searchMovies(String keyword) {
		return movieRepository
				.findByTitleContainingIgnoreCaseOrDirectorContainingIgnoreCaseOrActorsContainingIgnoreCase(keyword,
						keyword, keyword)
				.stream()
				.map(movie -> MovieResponse.builder().id(movie.getId()).title(movie.getTitle())
						.posterUrl(movie.getPosterUrl()).status(movie.getStatus()).build())
				.collect(Collectors.toList());
	}

}
