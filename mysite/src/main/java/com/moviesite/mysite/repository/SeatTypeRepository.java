package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.SeatType;

import java.util.Optional;

@Repository
public interface SeatTypeRepository extends JpaRepository<SeatType, Long> {
	Optional<SeatType> findByName(String name);
}
