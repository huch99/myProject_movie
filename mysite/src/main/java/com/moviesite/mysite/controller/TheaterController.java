package com.moviesite.mysite.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.moviesite.mysite.model.dto.request.TheaterRequest;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.service.TheaterService;

import java.util.List;

@RestController
@RequestMapping("/api/theaters")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TheaterController {
	
	@Autowired
	private TheaterService theaterService;
	
	@GetMapping
	public ResponseEntity<List<TheaterResponse>> getAllTheaters() {
		List<TheaterResponse> theaters = theaterService.getAllTheaters();
		return ResponseEntity.ok(theaters);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<TheaterResponse> getTheaterById(@PathVariable Long id) {
		TheaterResponse theater = theaterService.getTheaterById(id);
		return ResponseEntity.ok(theater);
	}
	
	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<TheaterResponse> createTheater(@RequestBody TheaterRequest theaterRequest) {
		TheaterResponse createdTheater = theaterService.createTheater(theaterRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdTheater);
	}
	
	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TheaterResponse> updateTheater(
            @PathVariable Long id, 
            @RequestBody TheaterRequest theaterRequest) {
        TheaterResponse updatedTheater = theaterService.updateTheater(id, theaterRequest);
        return ResponseEntity.ok(updatedTheater);
    }
	
	@DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTheater(@PathVariable Long id) {
        theaterService.deleteTheater(id);
        return ResponseEntity.noContent().build();
    }
	
	@GetMapping("/location/{location}")
    public ResponseEntity<List<TheaterResponse>> getTheatersByLocation(@PathVariable String location) {
        List<TheaterResponse> theaters = theaterService.getTheatersByLocation(location);
        return ResponseEntity.ok(theaters);
    }
    
    @GetMapping("/{id}/screens")
    public ResponseEntity<TheaterResponse> getTheaterWithScreens(@PathVariable Long id) {
        TheaterResponse theater = theaterService.getTheaterWithScreens(id);
        return ResponseEntity.ok(theater);
    }
}
