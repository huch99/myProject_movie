package com.moviesite.mysite.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Booking;
import com.moviesite.mysite.model.entity.Booking.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
	List<Booking> findByUserId(Long userId);

	Optional<Booking> findByBookingNumber(String bookingNumber);

	List<Booking> findByScreeningId(Long screeningId);

	List<Booking> findByScreeningIdAndStatus(Long screeningId, BookingStatus status);
}
