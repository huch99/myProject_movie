package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.dto.SeatDTO;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.repository.ReservationSeatRepository;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.SeatRepository;

import jakarta.persistence.EntityNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatService {

	private final SeatRepository seatRepository;
    private final ScreenRepository screenRepository;
    private final ReservationSeatRepository reservationSeatRepository;

    // 특정 좌석 정보 조회
    public SeatDTO getSeatById(Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Seat not found with id: " + id));
        return SeatDTO.fromEntity(seat);
    }

    // 특정 상영관의 모든 좌석 조회
    public List<SeatDTO> getSeatsByScreenId(Long screenId) {
        return seatRepository.findByScreenId(screenId).stream()
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관의 좌석 배치도 조회
    public Map<String, List<SeatDTO>> getScreenSeatLayout(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        Map<String, List<SeatDTO>> seatLayout = new LinkedHashMap<>();
        
        // 행별로 좌석 그룹화
        seats.stream()
                .map(SeatDTO::fromEntity)
                .forEach(seat -> {
                    String rowName = seat.getRowName();
                    if (!seatLayout.containsKey(rowName)) {
                        seatLayout.put(rowName, new ArrayList<>());
                    }
                    seatLayout.get(rowName).add(seat);
                });
        
        // 각 행 내에서 열 번호순으로 정렬
        seatLayout.forEach((row, seatList) -> 
                seatList.sort(Comparator.comparing(SeatDTO::getColumnNumber)));
        
        return seatLayout;
    }

    // 특정 타입의 좌석 조회
    public List<SeatDTO> getSeatsByType(Long screenId, String seatType) {
        Seat.SeatType type = Seat.SeatType.valueOf(seatType);
        return seatRepository.findByScreenIdAndSeatType(screenId, type).stream()
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 새 좌석 등록
    @Transactional
    public SeatDTO createSeat(SeatDTO seatDTO) {
        Screen screen = screenRepository.findById(seatDTO.getScreenId())
                .orElseThrow(() -> new EntityNotFoundException("Screen not found with id: " + seatDTO.getScreenId()));
        
        Seat seat = seatDTO.toEntity();
        seat.setScreen(screen);
        
        Seat savedSeat = seatRepository.save(seat);
        return SeatDTO.fromEntity(savedSeat);
    }

    // 여러 좌석 일괄 생성
    @Transactional
    public List<SeatDTO> createSeats(List<SeatDTO> seatDTOs) {
        if (seatDTOs.isEmpty()) {
            return Collections.emptyList();
        }
        
        Long screenId = seatDTOs.get(0).getScreenId();
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new EntityNotFoundException("Screen not found with id: " + screenId));
        
        List<Seat> seats = seatDTOs.stream()
                .map(dto -> {
                    Seat seat = dto.toEntity();
                    seat.setScreen(screen);
                    return seat;
                })
                .collect(Collectors.toList());
        
        List<Seat> savedSeats = seatRepository.saveAll(seats);
        return savedSeats.stream()
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 좌석 정보 수정
    @Transactional
    public SeatDTO updateSeat(Long id, SeatDTO seatDTO) {
        Seat existingSeat = seatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Seat not found with id: " + id));
        
        // 기존 좌석 정보 업데이트
        Seat updatedSeat = seatDTO.toEntity();
        updatedSeat.setId(id);
        updatedSeat.setScreen(existingSeat.getScreen());
        
        // 생성일자 유지
        updatedSeat.setCreatedAt(existingSeat.getCreatedAt());
        
        Seat savedSeat = seatRepository.save(updatedSeat);
        return SeatDTO.fromEntity(savedSeat);
    }

    // 좌석 삭제
    @Transactional
    public void deleteSeat(Long id) {
        if (!seatRepository.existsById(id)) {
            throw new EntityNotFoundException("Seat not found with id: " + id);
        }
        seatRepository.deleteById(id);
    }
    
    // 좌석 활성화/비활성화
    @Transactional
    public SeatDTO updateSeatStatus(Long id, Boolean isActive) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Seat not found with id: " + id));
        
        seat.setIsActive(isActive);
        Seat savedSeat = seatRepository.save(seat);
        return SeatDTO.fromEntity(savedSeat);
    }
    
    // 특정 상영 일정에 예약된 좌석 조회
    public List<SeatDTO> getReservedSeatsByScheduleId(Long scheduleId) {
        List<Long> reservedSeatIds = reservationSeatRepository.findSeatIdsByScheduleId(scheduleId);
        if (reservedSeatIds.isEmpty()) {
            return Collections.emptyList();
        }
        
        List<Seat> reservedSeats = seatRepository.findAllById(reservedSeatIds);
        return reservedSeats.stream()
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
 // 특정 상영 일정에 예약 가능한 좌석 조회
    public List<SeatDTO> getAvailableSeatsByScheduleId(Long scheduleId) {
        // 해당 상영관의 모든 좌석 조회
        Long screenId = reservationSeatRepository.findScreenIdByScheduleId(scheduleId);
        if (screenId == null) {
            throw new EntityNotFoundException("Screen not found for schedule id: " + scheduleId);
        }
        
        // 예약 가능한 좌석 목록 조회 
        List<Seat> allSeats = seatRepository.findByScreenIdAndIsActiveTrue(screenId);
        
        // 예약된 좌석 ID 목록 조회
        List<Long> reservedSeatIds = reservationSeatRepository.findSeatIdsByScheduleId(scheduleId);
        
        // 예약되지 않은 좌석만 필터링
        return allSeats.stream()
                .filter(seat -> !reservedSeatIds.contains(seat.getId()))
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 특정 행의 좌석 조회
    public List<SeatDTO> getSeatsByRow(Long screenId, String rowName) {
        return seatRepository.findByScreenIdAndRowNameOrderByColumnNumber(screenId, rowName).stream()
                .map(SeatDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 특정 좌석 라벨로 좌석 조회
    public SeatDTO getSeatBySeatLabel(Long screenId, String seatLabel) {
        Seat seat = seatRepository.findBySeatLabel(screenId, seatLabel);
        if (seat == null) {
            throw new EntityNotFoundException("Seat not found with label: " + seatLabel + " in screen: " + screenId);
        }
        return SeatDTO.fromEntity(seat);
    }
    
    // 특정 상영관의 모든 행 목록 조회
    public List<String> getRowsByScreenId(Long screenId) {
        return seatRepository.findByScreenId(screenId).stream()
                .map(Seat::getRowName)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    // 특정 상영관의 모든 열 목록 조회
    public List<Integer> getColumnsByScreenId(Long screenId) {
        return seatRepository.findByScreenId(screenId).stream()
                .map(Seat::getColumnNumber)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
}
