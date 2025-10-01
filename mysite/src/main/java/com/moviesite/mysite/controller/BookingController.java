package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.BookingRequest;
import com.moviesite.mysite.model.dto.response.BookingResponse;
import com.moviesite.mysite.service.BookingService;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {
	@Autowired
	private BookingService bookingService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<BookingResponse>> getAllBookings() {
		List<BookingResponse> bookings = bookingService.getAllBookings();
		return ResponseEntity.ok(bookings);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
		BookingResponse booking = bookingService.getBookingById(id);
		return ResponseEntity.ok(booking);
	}

	@PostMapping
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest bookingRequest) {
		BookingResponse createdBooking = bookingService.createBooking(bookingRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
	}

	@PutMapping("/{id}/cancel")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id) {
		BookingResponse canceledBooking = bookingService.cancelBooking(id);
		return ResponseEntity.ok(canceledBooking);
	}

	@GetMapping("/user/{userId}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<List<BookingResponse>> getBookingsByUser(@PathVariable Long userId) {
		List<BookingResponse> bookings = bookingService.getBookingsByUser(userId);
		return ResponseEntity.ok(bookings);
	}

	@GetMapping("/number/{bookingNumber}")
	@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
	public ResponseEntity<BookingResponse> getBookingByNumber(@PathVariable String bookingNumber) {
		BookingResponse booking = bookingService.getBookingByNumber(bookingNumber);
		return ResponseEntity.ok(booking);
	}
}
