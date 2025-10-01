package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.ScreeningRequest;
import com.moviesite.mysite.model.dto.response.ScreeningResponse;
import com.moviesite.mysite.service.ScreeningService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/screenings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScreeningController {

	@Autowired
	private ScreeningService screeningService;
    
    @GetMapping
    public ResponseEntity<List<ScreeningResponse>> getAllScreenings() {
        List<ScreeningResponse> screenings = screeningService.getAllScreenings();
        return ResponseEntity.ok(screenings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ScreeningResponse> getScreeningById(@PathVariable Long id) {
        ScreeningResponse screening = screeningService.getScreeningById(id);
        return ResponseEntity.ok(screening);
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScreeningResponse> createScreening(@RequestBody ScreeningRequest screeningRequest) {
        ScreeningResponse createdScreening = screeningService.createScreening(screeningRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdScreening);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScreeningResponse> updateScreening(
            @PathVariable Long id, 
            @RequestBody ScreeningRequest screeningRequest) {
        ScreeningResponse updatedScreening = screeningService.updateScreening(id, screeningRequest);
        return ResponseEntity.ok(updatedScreening);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteScreening(@PathVariable Long id) {
        screeningService.deleteScreening(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ScreeningResponse>> getScreeningsByMovie(@PathVariable Long movieId) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsByMovie(movieId);
        return ResponseEntity.ok(screenings);
    }
    
    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<ScreeningResponse>> getScreeningsByTheater(@PathVariable Long theaterId) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsByTheater(theaterId);
        return ResponseEntity.ok(screenings);
    }
    
    @GetMapping("/date")
    public ResponseEntity<List<ScreeningResponse>> getScreeningsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ScreeningResponse> screenings = screeningService.getScreeningsByDate(date);
        return ResponseEntity.ok(screenings);
    }
    
    @GetMapping("/movie/{movieId}/theater/{theaterId}/date")
    public ResponseEntity<List<ScreeningResponse>> getScreeningsByMovieTheaterAndDate(
            @PathVariable Long movieId,
            @PathVariable Long theaterId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ScreeningResponse> screenings = 
            screeningService.getScreeningsByMovieTheaterAndDate(movieId, theaterId, date);
        return ResponseEntity.ok(screenings);
    }
}
