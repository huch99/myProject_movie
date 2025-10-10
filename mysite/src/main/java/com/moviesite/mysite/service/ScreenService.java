package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.dto.ScheduleDTO;
import com.moviesite.mysite.dto.ScreenDTO;
import com.moviesite.mysite.dto.SeatDTO;
import com.moviesite.mysite.model.entity.Schedule;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.repository.ScheduleRepository;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.SeatRepository;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScreenService {

	private final ScreenRepository screenRepository;
    private final SeatRepository seatRepository;
    private final ScheduleRepository scheduleRepository;

    // 모든 상영관 목록 조회
    public List<ScreenDTO> getAllScreens() {
        return screenRepository.findAll().stream()
                .map(ScreenDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관 정보 조회
    public ScreenDTO getScreenById(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screen not found with id: " + id));
        return ScreenDTO.fromEntity(screen);
    }

    // 특정 극장의 상영관 목록 조회
    public List<ScreenDTO> getScreensByTheaterId(Long theaterId) {
        return screenRepository.findByTheaterId(theaterId).stream()
                .map(ScreenDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관의 좌석 목록 조회
    public List<SeatDTO> getSeatsByScreenId(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        return seats.stream()
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 타입의 상영관 조회
    public List<ScreenDTO> getScreensByType(String type) {
        return screenRepository.findByType(type).stream()
                .map(ScreenDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 상영관 등록
    @Transactional
    public ScreenDTO createScreen(ScreenDTO screenDTO) {
        // Theater 엔티티 참조 설정 필요
        Screen screen = screenDTO.toEntity();
        Screen savedScreen = screenRepository.save(screen);
        return ScreenDTO.fromEntity(savedScreen);
    }

    // 상영관 정보 수정
    @Transactional
    public ScreenDTO updateScreen(Long id, ScreenDTO screenDTO) {
        Screen existingScreen = screenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screen not found with id: " + id));
        
        // 기존 상영관 정보 업데이트
        Screen updatedScreen = screenDTO.toEntity();
        updatedScreen.setId(id);
        updatedScreen.setTheater(existingScreen.getTheater());
        
        // 생성일자 유지
        updatedScreen.setCreatedAt(existingScreen.getCreatedAt());
        
        Screen savedScreen = screenRepository.save(updatedScreen);
        return ScreenDTO.fromEntity(savedScreen);
    }

    // 상영관 삭제
    @Transactional
    public void deleteScreen(Long id) {
        if (!screenRepository.existsById(id)) {
            throw new EntityNotFoundException("Screen not found with id: " + id);
        }
        screenRepository.deleteById(id);
    }

    // 특정 상영관의 수용 인원 조회
    public Integer getScreenCapacity(Long id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Screen not found with id: " + id));
        return screen.getSeatsCount();
    }

    // 특정 상영관의 현재 상영 중인 영화 일정 조회
    public List<ScheduleDTO> getCurrentSchedulesByScreenId(Long screenId) {
        LocalDateTime now = LocalDateTime.now();
        List<Schedule> currentSchedules = scheduleRepository.findByScreenIdAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                screenId, now, now);
        return currentSchedules.stream()
                .map(ScheduleDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관의 향후 상영 일정 조회
    public List<ScheduleDTO> getUpcomingSchedulesByScreenId(Long screenId) {
        LocalDateTime now = LocalDateTime.now();
        List<Schedule> upcomingSchedules = scheduleRepository.findByScreenIdAndStartTimeAfterOrderByStartTime(
                screenId, now);
        return upcomingSchedules.stream()
                .map(ScheduleDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
