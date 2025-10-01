package com.moviesite.mysite.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.repository.TheaterRepository;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.TheaterRequest;
import com.moviesite.mysite.model.dto.response.ScreenResponse;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.model.entity.Theater;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TheaterService {
	@Autowired
	 private TheaterRepository theaterRepository;

	    @Transactional(readOnly = true)
	    public List<TheaterResponse> getAllTheaters() {
	        return theaterRepository.findAll().stream()
	                .map(TheaterResponse::fromEntity)
	                .collect(Collectors.toList());
	    }

	    @Transactional(readOnly = true)
	    public TheaterResponse getTheaterById(Long id) {
	        Theater theater = theaterRepository.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + id));
	        return TheaterResponse.fromEntity(theater);
	    }

	    @Transactional
	    public TheaterResponse createTheater(TheaterRequest request) {
	        // Builder 패턴 대신 일반 객체 생성 방식 사용
	        Theater theater = new Theater();
	        theater.setName(request.getName());
	        theater.setLocation(request.getLocation());
	        theater.setAddress(request.getAddress());
	        theater.setPhone(request.getPhone());
	        theater.setTotalScreens(request.getTotalScreens() != null ? request.getTotalScreens() : 0);
	        
	        Theater savedTheater = theaterRepository.save(theater);
	        return TheaterResponse.fromEntity(savedTheater);
	    }

	    @Transactional
	    public TheaterResponse updateTheater(Long id, TheaterRequest request) {
	        Theater theater = theaterRepository.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + id));

	        theater.setName(request.getName());
	        theater.setLocation(request.getLocation());
	        theater.setAddress(request.getAddress());
	        theater.setPhone(request.getPhone());
	        theater.setTotalScreens(request.getTotalScreens());
	        theater.setUpdatedAt(LocalDateTime.now());
	        Theater updatedTheater = theaterRepository.save(theater);
	        return TheaterResponse.fromEntity(updatedTheater);
	    }

	    @Transactional
	    public void deleteTheater(Long id) {
	        theaterRepository.deleteById(id);
	    }
	    
	    @Transactional(readOnly = true)
	    public List<TheaterResponse> getTheatersByLocation(String location) {
	        return theaterRepository.findByLocation(location).stream()
	                .map(TheaterResponse::fromEntity)
	                .collect(Collectors.toList());
	    }

	    @Transactional(readOnly = true)
	    public TheaterResponse getTheaterWithScreens(Long id) {
	        Theater theater = theaterRepository.findById(id)
	                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + id));
	        // LAZY 로딩이기 때문에, 이 시점에 `getScreens()`를 호출하여 프록시 초기화
	        List<ScreenResponse> screens = theater.getScreens().stream()
	                .map(ScreenResponse::fromEntity)
	                .collect(Collectors.toList());
	        
	        // Builder 패턴 대신 일반 객체 생성 방식 사용
	        TheaterResponse response = new TheaterResponse();
	        response.setId(theater.getId());
	        response.setName(theater.getName());
	        response.setLocation(theater.getLocation());
	        response.setAddress(theater.getAddress());
	        response.setPhone(theater.getPhone());
	        response.setTotalScreens(theater.getTotalScreens());
	        response.setScreens(screens);
	        return response;
	    }
}
