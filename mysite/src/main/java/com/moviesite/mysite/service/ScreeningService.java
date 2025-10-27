package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.ScreeningRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.ScreeningResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Schedule;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Screening;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.ScheduleRepository;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.ScreeningRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScreeningService {

    private final ScreeningRepository screeningRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    // 특정 영화의 상영 정보 조회
    public List<ScreeningResponse> getScreeningsByMovie(Long movieId) {
        List<Screening> screenings = screeningRepository.findByMovieIdAndStatusAndScreeningDateAfterOrderByScreeningDateAscScreeningTimeAsc(
                movieId, Screening.ScreeningStatus.ACTIVE, LocalDate.now());

        return screenings.stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관의 상영 정보 조회
    public List<ScreeningResponse> getScreeningsByScreen(Long screenId) {
        List<Screening> screenings = screeningRepository.findByScreenIdAndStatusAndScreeningDateAfterOrderByScreeningDateAscScreeningTimeAsc(
                screenId, Screening.ScreeningStatus.ACTIVE, LocalDate.now());

        return screenings.stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 극장의 상영 정보 조회
    public List<ScreeningResponse> getScreeningsByTheater(Long theaterId, LocalDate date) {
        try {
        	List<Screening> screenings = screeningRepository.findScreeningsByTheaterAndDate(
                    theaterId, Screening.ScreeningStatus.ACTIVE, date);

            return screenings.stream()
                    .map(ScreeningResponse::fromEntity)
                    .collect(Collectors.toList());
		} catch (Exception e) {
			 System.out.println("=========================================");
	            System.out.println("ScreenService.getScreeningsByTheater 오류 발생!");
	            e.printStackTrace(); // 이 줄을 추가해서 콘솔에 스택 트레이스를 찍어봅니다.
	            System.out.println("=========================================");
	            throw new RuntimeException("극장 ID로 상영관 조회 중 서비스 오류 발생", e);
		}
    	
    }

    // 특정 스케줄의 상영 정보 조회
    public List<ScreeningResponse> getScreeningsBySchedule(Long scheduleId) {
        List<Screening> screenings = screeningRepository.findByScheduleIdAndStatusOrderByScreeningDateAscScreeningTimeAsc(
                scheduleId, Screening.ScreeningStatus.ACTIVE);

        return screenings.stream()
                .map(ScreeningResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영 정보 상세 조회
    public ScreeningResponse getScreeningById(Long id) {
        Screening screening = findScreeningById(id);
        return ScreeningResponse.fromEntity(screening);
    }

    // 상영 정보 생성 (관리자용)
    @Transactional
    public ScreeningResponse createScreening(ScreeningRequest request) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        // 영화 존재 여부 확인
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));

        // 상영관 존재 여부 확인
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));

        // 스케줄 존재 여부 확인
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + request.getScheduleId()));

        // 시간 유효성 검사
        validateScreeningTime(request.getScreeningDate(), request.getScreeningTime(), request.getEndTime(), screen.getId(), null);

        // 상영 정보 생성
        Screening screening = Screening.builder()
                .movie(movie)
                .screen(screen)
                .schedule(schedule)
                .screeningDate(request.getScreeningDate())
                .screeningTime(request.getScreeningTime())
                .endTime(request.getEndTime())
                .isFull(request.getIsFull())
                .availableSeats(request.getAvailableSeats())
                .status(request.getStatus() != null ?
                        Screening.ScreeningStatus.valueOf(request.getStatus()) : Screening.ScreeningStatus.ACTIVE)
                .build();

        Screening savedScreening = screeningRepository.save(screening);
        return ScreeningResponse.fromEntity(savedScreening);
    }

    // 상영 정보 수정 (관리자용)
    @Transactional
    public ScreeningResponse updateScreening(Long id, ScreeningRequest request) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        Screening screening = findScreeningById(id);

        // 영화 존재 여부 확인
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));

        // 상영관 존재 여부 확인
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));

        // 스케줄 존재 여부 확인
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + request.getScheduleId()));

        // 시간 유효성 검사
        validateScreeningTime(request.getScreeningDate(), request.getScreeningTime(), request.getEndTime(), screen.getId(), id);

        // 상영 정보 업데이트
        screening.setMovie(movie);
        screening.setScreen(screen);
        screening.setSchedule(schedule);
        screening.setScreeningDate(request.getScreeningDate());
        screening.setScreeningTime(request.getScreeningTime());
        screening.setEndTime(request.getEndTime());
        screening.setIsFull(request.getIsFull());
        screening.setAvailableSeats(request.getAvailableSeats());

        if (request.getStatus() != null) {
            screening.setStatus(Screening.ScreeningStatus.valueOf(request.getStatus()));
        }

        screening.setUpdatedAt(LocalDateTime.now());

        Screening updatedScreening = screeningRepository.save(screening);
        return ScreeningResponse.fromEntity(updatedScreening);
    }

    // 상영 정보 상태 변경 (관리자용)
    @Transactional
    public ScreeningResponse updateScreeningStatus(Long id, String status) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        Screening screening = findScreeningById(id);
        screening.setStatus(Screening.ScreeningStatus.valueOf(status));
        screening.setUpdatedAt(LocalDateTime.now());

        Screening updatedScreening = screeningRepository.save(screening);
        return ScreeningResponse.fromEntity(updatedScreening);
    }

    // 상영 정보 삭제 (관리자용)
    @Transactional
    public void deleteScreening(Long id) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        Screening screening = findScreeningById(id);
        screeningRepository.delete(screening);
    }

    // 상영 시간 유효성 검사 (내부 메서드)
    private void validateScreeningTime(LocalDate date, LocalTime startTime, LocalTime endTime, Long screenId, Long excludeScreeningId) {
        // 시작 시간이 종료 시간보다 이후인지 확인
        if (startTime.isAfter(endTime)) {
            throw new BadRequestException("시작 시간은 종료 시간보다 이전이어야 합니다");
        }

        // 상영 시간 중복 확인
        LocalDateTime screeningStart = LocalDateTime.of(date, startTime);
        LocalDateTime screeningEnd = LocalDateTime.of(date, endTime);

        List<Screening> overlappingScreenings;

        if (excludeScreeningId != null) {
            overlappingScreenings = screeningRepository.findOverlappingScreeningsExcluding(
                    screenId, date, startTime, endTime, excludeScreeningId);
        } else {
            overlappingScreenings = screeningRepository.findOverlappingScreenings(
                    screenId, date, startTime, endTime);
        }

        if (!overlappingScreenings.isEmpty()) {
            throw new BadRequestException("해당 상영관에 이미 같은 시간대에 예정된 상영이 있습니다");
        }
    }

    // 상영 엔티티 조회 (내부 메서드)
    private Screening findScreeningById(Long id) {
        return screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Screening not found with id: " + id));
    }

    // 현재 로그인한 사용자 조회
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}