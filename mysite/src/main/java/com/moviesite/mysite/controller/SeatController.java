package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.response.SeatResponse;
import com.moviesite.mysite.service.SeatService;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SeatController {
	@Autowired
	private SeatService seatService;

	@GetMapping("/screen/{screenId}")
	public ResponseEntity<List<SeatResponse>> getSeatsByScreen(@PathVariable Long screenId) {
		List<SeatResponse> seats = seatService.getSeatsByScreen(screenId);
		return ResponseEntity.ok(seats);
	}

	@GetMapping("/screening/{screeningId}")
	public ResponseEntity<List<SeatResponse>> getAvailableSeatsByScreening(@PathVariable Long screeningId) {
		List<SeatResponse> seats = seatService.getAvailableSeatsByScreening(screeningId);
		return ResponseEntity.ok(seats);
	}

	@GetMapping("/screening/{screeningId}/booked")
	public ResponseEntity<List<SeatResponse>> getBookedSeatsByScreening(@PathVariable Long screeningId) {
		List<SeatResponse> seats = seatService.getBookedSeatsByScreening(screeningId);
		return ResponseEntity.ok(seats);
	}
}
