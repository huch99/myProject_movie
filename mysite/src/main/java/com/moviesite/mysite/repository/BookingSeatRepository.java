package com.moviesite.mysite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.moviesite.mysite.model.entity.BookingSeat;

@Repository
public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
	List<BookingSeat> findByBookingId(Long bookingId);

	List<BookingSeat> findBySeatId(Long seatId);
	
	List<BookingSeat> findByBooking_ScreeningId(Long screeningId);
}
