package com.moviesite.mysite.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.ScreeningRepository;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.ScreeningRequest;
import com.moviesite.mysite.model.dto.response.*;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Screening;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ScreeningService {
	@Autowired
	private ScreeningRepository screeningRepository;
    private MovieRepository movieRepository;
    private ScreenRepository screenRepository;

    @Transactional(readOnly = true)
    public List<ScreeningResponse> getAllScreenings() {
        return screeningRepository.findAll().stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ScreeningResponse getScreeningById(Long id) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening not found with id: " + id));
        return ScreeningResponse.fromEntity(screening);
    }

    @Transactional
    public ScreeningResponse createScreening(ScreeningRequest request) {
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));

        // 상영 시간 검증: 같은 상영관에 중복된 시간대의 상영이 있는지 확인
        List<Screening> overlappingScreenings = screeningRepository.findByScreenIdAndStartTimeBeforeAndEndTimeAfter(
            screen.getId(), request.getEndTime(), request.getStartTime()
        );
        if (!overlappingScreenings.isEmpty()) {
            throw new BadRequestException("Overlapping screening times in the same screen.");
        }

     // Builder 패턴 대신 일반 객체 생성 방식 사용
        Screening screening = new Screening();
        screening.setMovie(movie);
        screening.setScreen(screen);
        screening.setStartTime(request.getStartTime());
        screening.setEndTime(request.getEndTime());
        screening.setBasePrice(request.getBasePrice());
        Screening savedScreening = screeningRepository.save(screening);
        return ScreeningResponse.fromEntity(savedScreening);
    }

    @Transactional
    public ScreeningResponse updateScreening(Long id, ScreeningRequest request) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening not found with id: " + id));
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));

        // 상영 시간 검증 (업데이트 시에도 필요)
        List<Screening> overlappingScreenings = screeningRepository.findByScreenIdAndStartTimeBeforeAndEndTimeAfter(
                screen.getId(), request.getEndTime(), request.getStartTime()
        ).stream().filter(s -> !s.getId().equals(id)).collect(Collectors.toList()); // 현재 업데이트 중인 상영 제외
        if (!overlappingScreenings.isEmpty()) {
            throw new BadRequestException("Overlapping screening times in the same screen.");
        }

        screening.setMovie(movie);
        screening.setScreen(screen);
        screening.setStartTime(request.getStartTime());
        screening.setEndTime(request.getEndTime());
        screening.setBasePrice(request.getBasePrice());
        screening.setUpdatedAt(LocalDateTime.now());
        Screening updatedScreening = screeningRepository.save(screening);
        return ScreeningResponse.fromEntity(updatedScreening);
    }

    @Transactional
    public void deleteScreening(Long id) {
        screeningRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ScreeningResponse> getScreeningsByMovie(Long movieId) {
        return screeningRepository.findByMovieId(movieId).stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScreeningResponse> getScreeningsByTheater(Long theaterId) {
        return screeningRepository.findByScreenTheaterId(theaterId).stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScreeningResponse> getScreeningsByDate(LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return screeningRepository.findByStartTimeBetween(startOfDay, endOfDay).stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScreeningResponse> getScreeningsByMovieTheaterAndDate(Long movieId, Long theaterId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return screeningRepository.findByMovieIdAndScreenTheaterIdAndStartTimeBetween(movieId, theaterId, startOfDay, endOfDay)
                .stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
