package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.SeatRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.SeatResponse;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.SeatRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatService {

    private final SeatRepository seatRepository;
    private final ScreenRepository screenRepository;
    private final UserRepository userRepository;

    // 특정 상영관의 모든 좌석 조회
    public List<SeatResponse> getSeatsByScreenId(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        return seats.stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 상영관의 활성화된 좌석만 조회
    public List<SeatResponse> getActiveSeats(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenIdAndIsActiveTrue(screenId);
        return seats.stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 좌석 상세 조회
    public SeatResponse getSeatById(Long id) {
        Seat seat = findSeatById(id);
        return SeatResponse.fromEntity(seat);
    }

    // 상영관의 좌석 배치도 정보 조회
    public Map<String, Object> getSeatMap(Long screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));

        List<Seat> seats = seatRepository.findByScreenId(screenId);
        List<String> rows = seatRepository.findDistinctRowNamesByScreenId(screenId);

        Map<String, List<SeatResponse>> seatsByRow = new HashMap<>();

        for (String row : rows) {
            List<Seat> rowSeats = seats.stream()
                    .filter(s -> s.getRowName().equals(row))
                    .sorted((s1, s2) -> s1.getColumnNumber().compareTo(s2.getColumnNumber()))
                    .collect(Collectors.toList());

            List<SeatResponse> rowSeatResponses = rowSeats.stream()
                    .map(SeatResponse::fromEntity)
                    .collect(Collectors.toList());

            seatsByRow.put(row, rowSeatResponses);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("screenId", screenId);
        result.put("screenName", screen.getName());
        result.put("rowCount", screen.getRowCount());
        result.put("columnCount", screen.getColumnCount());
        result.put("rows", rows);
        result.put("seatMap", seatsByRow);

        return result;
    }

    // 좌석 생성 (관리자용)
    @Transactional
    public SeatResponse createSeat(SeatRequest request) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        // 상영관 존재 여부 확인
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));

        // 좌석 중복 확인
        if (seatRepository.existsByScreenIdAndRowNameAndColumnNumber(
                request.getScreenId(), request.getRowName(), request.getColumnNumber())) {
            throw new BadRequestException("이미 존재하는 좌석입니다");
        }

        // 좌석 생성
        Seat seat = Seat.builder()
                .screen(screen)
                .rowName(request.getRowName())
                .columnNumber(request.getColumnNumber())
                .seatType(Seat.SeatType.valueOf(request.getSeatType()))
                .isActive(request.getIsActive())
                .build();

        Seat savedSeat = seatRepository.save(seat);
        return SeatResponse.fromEntity(savedSeat);
    }

    // 좌석 정보 수정 (관리자용)
    @Transactional
    public SeatResponse updateSeat(Long id, SeatRequest request) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        Seat seat = findSeatById(id);

        // 상영관 존재 여부 확인
        Screen screen = screenRepository.findById(request.getScreenId())
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + request.getScreenId()));

        // 좌석 중복 확인 (자기 자신 제외)
        if (!seat.getScreen().getId().equals(request.getScreenId()) ||
                !seat.getRowName().equals(request.getRowName()) ||
                !seat.getColumnNumber().equals(request.getColumnNumber())) {

            if (seatRepository.existsByScreenIdAndRowNameAndColumnNumber(
                    request.getScreenId(), request.getRowName(), request.getColumnNumber())) {
                throw new BadRequestException("이미 존재하는 좌석입니다");
            }
        }

        // 좌석 정보 업데이트
        seat.setScreen(screen);
        seat.setRowName(request.getRowName());
        seat.setColumnNumber(request.getColumnNumber());
        seat.setSeatType(Seat.SeatType.valueOf(request.getSeatType()));
        seat.setIsActive(request.getIsActive());
        seat.setUpdatedAt(LocalDateTime.now());

        Seat updatedSeat = seatRepository.save(seat);
        return SeatResponse.fromEntity(updatedSeat);
    }

    // 좌석 상태 변경 (활성화/비활성화) (관리자용)
    @Transactional
    public SeatResponse updateSeatStatus(Long id, Boolean isActive) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        Seat seat = findSeatById(id);
        seat.setIsActive(isActive);
        seat.setUpdatedAt(LocalDateTime.now());

        Seat updatedSeat = seatRepository.save(seat);
        return SeatResponse.fromEntity(updatedSeat);
    }

    // 좌석 삭제 (관리자용)
    @Transactional
    public void deleteSeat(Long id) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        Seat seat = findSeatById(id);
        seatRepository.delete(seat);
    }

        // 상영관 좌석 일괄 생성 (관리자용)
    @Transactional
    public List<SeatResponse> createSeatsForScreen(Long screenId) {
        // 관리자 권한 확인
        User currentUser = getAuthenticatedUser();
        if (!currentUser.isAdmin()) {
            throw new BadRequestException("관리자만 접근 가능합니다");
        }

        // 상영관 존재 여부 확인
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + screenId));

        // 이미 좌석이 있는지 확인
        List<Seat> existingSeats = seatRepository.findByScreenId(screenId);
        if (!existingSeats.isEmpty()) {
            throw new BadRequestException("해당 상영관에 이미 좌석이 존재합니다");
        }

        // 행과 열 수 확인
        int rowCount = screen.getRowCount();
        int columnCount = screen.getColumnCount();

        // 좌석 일괄 생성
        List<Seat> seats = new ArrayList<>();

        for (int i = 0; i < rowCount; i++) {
            String rowName = String.valueOf((char)('A' + i));

            for (int j = 1; j <= columnCount; j++) {
                Seat seat = Seat.builder()
                        .screen(screen)
                        .rowName(rowName)
                        .columnNumber(j)
                        .seatType(Seat.SeatType.STANDARD)
                        .isActive(true)
                        .build();

                seats.add(seat);
            }
        }

        List<Seat> savedSeats = seatRepository.saveAll(seats);
        return savedSeats.stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 좌석 엔티티 조회 (내부 메서드)
    private Seat findSeatById(Long id) {
        return seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + id));
    }

    // 현재 로그인한 사용자 조회
    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}