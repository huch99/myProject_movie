package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.ScheduleRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.ScheduleResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Schedule;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.ScheduleRepository;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScheduleService {

	private final ScheduleRepository scheduleRepository;
    private final MovieRepository movieRepository;
    private final ScreenRepository screenRepository;
    private final UserRepository userRepository;

    // 특정 상영 일정 상세 조회
    public ScheduleResponse getScheduleById(Long id) {
        Schedule schedule = findScheduleById(id);
        return ScheduleResponse.fromEntity(schedule);
    }

    // 상영 일정 등록 (관리자용)
    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
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
        
        // 시간 유효성 검사
        validateScheduleTime(request.getStartTime(), request.getEndTime(), screen.getId(), null);
        
        // 상영 일정 생성
        Schedule schedule = Schedule.builder()
                .movie(movie)
                .screen(screen)
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .price(request.getPrice())
                .availableSeats(screen.getSeatsCount())  // Screen 엔티티의 seatsCount 필드 사용
                .status(request.getStatus() != null ? 
                        Schedule.ScheduleStatus.valueOf(request.getStatus()) : Schedule.ScheduleStatus.OPEN)
                .build();
        
        Schedule savedSchedule = scheduleRepository.save(schedule);
        return ScheduleResponse.fromEntity(savedSchedule);
    }
    
    // 상영 일정 수정 (관리자용)
    @Transactional
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        Schedule schedule = findScheduleById(id);
        
        // 영화 존재 여부 확인
        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getMovieId()));
        
        // 상영관 존재 여부 확인
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));
        
        // 시간 유효성 검사
        validateScheduleTime(request.getStartTime(), request.getEndTime(), screen.getId(), id);
        
        // 상영 일정 업데이트
        schedule.setMovie(movie);
        schedule.setScreen(screen);
        schedule.setStartTime(request.getStartTime());
        schedule.setEndTime(request.getEndTime());
        schedule.setPrice(request.getPrice());
        
        // 상영관 변경 시 좌석 수 업데이트
        if (!schedule.getScreen().getId().equals(screen.getId())) {
            schedule.setAvailableSeats(screen.getSeatsCount());  // Screen 엔티티의 seatsCount 필드 사용
        }
        
        if (request.getStatus() != null) {
            schedule.setStatus(Schedule.ScheduleStatus.valueOf(request.getStatus()));
        }
        
        schedule.setUpdatedAt(LocalDateTime.now());
        
        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return ScheduleResponse.fromEntity(updatedSchedule);
    }
    
    // 상영 일정 상태 변경 (관리자용)
    @Transactional
    public ScheduleResponse updateScheduleStatus(Long id, String status) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        Schedule schedule = findScheduleById(id);
        schedule.setStatus(Schedule.ScheduleStatus.valueOf(status));
        schedule.setUpdatedAt(LocalDateTime.now());
        
        Schedule updatedSchedule = scheduleRepository.save(schedule);
        return ScheduleResponse.fromEntity(updatedSchedule);
    }
    
    // 상영 일정 삭제 (관리자용)
    @Transactional
    public void deleteSchedule(Long id) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }
        
        Schedule schedule = findScheduleById(id);
        scheduleRepository.delete(schedule);
    }
    
    // 상영 일정 시간 유효성 검사 (내부 메서드)
    private void validateScheduleTime(LocalDateTime startTime, LocalDateTime endTime, Long screenId, Long excludeScheduleId) {
        // 시작 시간이 종료 시간보다 이후인지 확인
        if (startTime.isAfter(endTime)) {
            throw new BadRequestException("시작 시간은 종료 시간보다 이전이어야 합니다");
        }
        
    }
    
    // 스케줄 엔티티 조회 (내부 메서드)
    private Schedule findScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
    }
    
    // 현재 로그인한 사용자 조회
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}