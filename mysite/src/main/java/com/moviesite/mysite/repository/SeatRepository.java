package com.moviesite.mysite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.moviesite.mysite.model.entity.Seat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
	List<Seat> findByScreenId(Long screenId);

	Optional<Seat> findByScreenIdAndSeatRowAndSeatNumber(Long screenId, Character seatRow, Integer seatNumber);
}
