package com.moviesite.mysite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Screen;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {
	List<Screen> findByTheaterId(Long theaterId);

	Optional<Screen> findByTheaterIdAndName(Long theaterId, String name);
}
