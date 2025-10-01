package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Movie;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
	List<Movie> findByStatus(Movie.MovieStatus status);

	List<Movie> findByTitleContainingIgnoreCaseOrDirectorContainingIgnoreCaseOrActorsContainingIgnoreCase(String title,
			String director, String actors);
}
