package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Theater;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, Long> {
	List<Theater> findByLocation(String location);
}
