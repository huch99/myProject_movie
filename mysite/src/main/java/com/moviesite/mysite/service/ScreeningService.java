package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.dto.MovieDTO;
import com.moviesite.mysite.dto.ScreeningDTO;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Screening;
import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.ScreeningRepository;
import com.moviesite.mysite.repository.SeatRepository;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScreeningService {

	private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final SeatRepository seatRepository;

    // 모든 상영 정보 조회
    public List<ScreeningDTO> getAllScreenings() {
        return screeningRepository.findAll().stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영 정보 조회
    public ScreeningDTO getScreeningById(Long id) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screening not found with id: " + id));
        return ScreeningDTO.fromEntity(screening);
    }

    // 특정 영화의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByMovieId(Long movieId) {
        return screeningRepository.findByMovieId(movieId).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByScreenId(Long screenId) {
        return screeningRepository.findByScreenId(screenId).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 날짜의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByDate(LocalDate date) {
        return screeningRepository.findByScreeningDate(date).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 영화, 특정 날짜의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByMovieAndDate(Long movieId, LocalDate date) {
        return screeningRepository.findByMovieIdAndScreeningDate(movieId, date).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 극장의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByTheaterId(Long theaterId) {
        return screeningRepository.findByScreenTheaterId(theaterId).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 극장, 특정 날짜의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByTheaterAndDate(Long theaterId, LocalDate date) {
        return screeningRepository.findByScreenTheaterIdAndScreeningDate(theaterId, date).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 극장, 특정 영화의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByTheaterAndMovie(Long theaterId, Long movieId) {
        return screeningRepository.findByScreenTheaterIdAndMovieId(theaterId, movieId).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 상영 정보 등록
    @Transactional
    public ScreeningDTO createScreening(ScreeningDTO screeningDTO) {
        Screening screening = screeningDTO.toEntity();
        Screening savedScreening = screeningRepository.save(screening);
        return ScreeningDTO.fromEntity(savedScreening);
    }

    // 상영 정보 수정
    @Transactional
    public ScreeningDTO updateScreening(Long id, ScreeningDTO screeningDTO) {
        Screening existingScreening = screeningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screening not found with id: " + id));
        
        // 기존 상영 정보 업데이트
        Screening updatedScreening = screeningDTO.toEntity();
        updatedScreening.setId(id);
        
        // 참조 엔티티 설정
        updatedScreening.setMovie(existingScreening.getMovie());
        updatedScreening.setScreen(existingScreening.getScreen());
        updatedScreening.setSchedule(existingScreening.getSchedule());
        
        // 생성일자 유지
        updatedScreening.setCreatedAt(existingScreening.getCreatedAt());
        
        Screening savedScreening = screeningRepository.save(updatedScreening);
        return ScreeningDTO.fromEntity(savedScreening);
    }

    // 상영 정보 삭제
    @Transactional
    public void deleteScreening(Long id) {
        if (!screeningRepository.existsById(id)) {
            throw new EntityNotFoundException("Screening not found with id: " + id);
        }
        screeningRepository.deleteById(id);
    }
    
    // 상영 정보 상태 변경
    @Transactional
    public ScreeningDTO updateScreeningStatus(Long id, String status) {
        Screening screening = screeningRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screening not found with id: " + id));
        
        screening.setStatus(Screening.ScreeningStatus.valueOf(status));
        Screening savedScreening = screeningRepository.save(screening);
        return ScreeningDTO.fromEntity(savedScreening);
    }
    
    // 특정 날짜 범위의 상영 정보 조회
    public List<ScreeningDTO> getScreeningsByDateRange(LocalDate startDate, LocalDate endDate) {
        return screeningRepository.findByScreeningDateBetween(startDate, endDate).stream()
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 특정 날짜에 상영하는 영화 목록 조회
    public List<MovieDTO> getMoviesByScreeningDate(LocalDate date) {
        List<Movie> movies = screeningRepository.findMoviesByScreeningDate(date);
        return movies.stream()
                .map(MovieDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
 // 특정 상영의 좌석 가용 상태 조회
    public Map<String, Object> getScreeningSeatsStatus(Long screeningId) {
        Screening screening = screeningRepository.findById(screeningId)
                .orElseThrow(() -> new EntityNotFoundException("Screening not found with id: " + screeningId));
        
        Map<String, Object> result = new HashMap<>();
        result.put("screeningId", screeningId);
        result.put("movieTitle", screening.getMovie().getTitle());
        result.put("screenName", screening.getScreen().getName());
        result.put("theaterName", screening.getScreen().getTheater().getName());
        result.put("screeningDate", screening.getScreeningDate());
        result.put("screeningTime", screening.getScreeningTime());
        result.put("endTime", screening.getEndTime());
        result.put("totalSeats", screening.getScreen().getSeatsCount());
        result.put("availableSeats", screening.getAvailableSeats());
        result.put("isFull", screening.getIsFull());
        
        // 예약된 좌석 목록 조회
        List<String> reservedSeats = screeningRepository.findReservedSeatsByScreeningId(screeningId);
        result.put("reservedSeats", reservedSeats);
        
        return result;
    }
    
    // 예매 가능한 상영 정보 조회
    public List<ScreeningDTO> getBookableScreenings() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();
        
        return screeningRepository.findByScreeningDateGreaterThanEqualAndStatusOrderByScreeningDate(
                today, Screening.ScreeningStatus.ACTIVE).stream()
                .filter(screening -> 
                    LocalDateTime.of(screening.getScreeningDate(), screening.getScreeningTime()).isAfter(now))
                .filter(screening -> !screening.getIsFull())
                .map(ScreeningDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 좌석 예약 처리
    @Transactional
    public boolean reserveSeats(Long screeningId, List<Long> seatIds) {
        Screening screening = screeningRepository.findById(screeningId)
                .orElseThrow(() -> new EntityNotFoundException("Screening not found with id: " + screeningId));
        
        // 이미 만석이거나 취소된 상영인지 확인
        if (screening.getIsFull() || screening.getStatus() != Screening.ScreeningStatus.ACTIVE) {
            return false;
        }
        
        // 좌석 예약 가능 여부 확인
        boolean allSeatsAvailable = seatIds.stream()
                .noneMatch(seatId -> screeningRepository.isSeatReserved(screeningId, seatId));
        
        if (!allSeatsAvailable) {
            return false;
        }
        
        // 좌석 예약 처리 및 가용 좌석 수 업데이트
        int reservedCount = seatIds.size();
        screening.setAvailableSeats(screening.getAvailableSeats() - reservedCount);
        
        // 만석 여부 확인 및 업데이트
        if (screening.getAvailableSeats() <= 0) {
            screening.setIsFull(true);
        }
        
        screeningRepository.save(screening);
        
        // 예약된 좌석 정보 저장 (별도 테이블에 저장하는 로직 필요)
        
        return true;
    }
}
