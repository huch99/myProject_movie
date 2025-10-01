package com.moviesite.mysite.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.SeatResponse;
import com.moviesite.mysite.model.entity.Booking;
import com.moviesite.mysite.model.entity.BookingSeat;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.model.entity.SeatType;
import com.moviesite.mysite.repository.BookingRepository;
import com.moviesite.mysite.repository.BookingSeatRepository;
import com.moviesite.mysite.repository.SeatRepository;
import com.moviesite.mysite.repository.SeatTypeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeatService {
	@Autowired
	private SeatRepository seatRepository;
    private BookingRepository bookingRepository;
    private BookingSeatRepository bookingSeatRepository;
    private SeatTypeRepository seatTypeRepository;

    @Transactional(readOnly = true)
    public List<SeatResponse> getSeatsByScreen(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        return seats.stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getAvailableSeatsByScreening(Long screeningId) {
        // 1. 상영관의 모든 좌석 조회
        List<Booking> bookings = bookingRepository.findByScreeningIdAndStatus(
                screeningId, Booking.BookingStatus.CONFIRMED);
        
        if (bookings.isEmpty()) {
            // 예약이 없으면 모든 좌석이 가용 상태
            List<Seat> allSeats = seatRepository.findByScreenId(
                    bookingRepository.findById(screeningId)
                            .orElseThrow(() -> new ResourceNotFoundException("Screening not found"))
                            .getScreening().getScreen().getId());
            return allSeats.stream()
                    .filter(seat -> seat.getIsActive() == true) // Boolean을 명시적으로 비교
                    .map(SeatResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        
        // 2. 예약된 좌석 ID 목록 조회
        Set<Long> bookedSeatIds = bookings.stream()
                .flatMap(booking -> booking.getBookingSeats().stream())
                .<Long>map(bookingSeat -> bookingSeat.getSeat().getId())
                .collect(Collectors.toSet());
        
        // 3. 상영관의 모든 좌석 중 예약되지 않은 좌석만 필터링
        Long screenId = bookings.get(0).getScreening().getScreen().getId();
        List<Seat> allSeats = seatRepository.findByScreenId(screenId);
        
        return allSeats.stream()
                .filter(seat -> seat.getIsActive() && !bookedSeatIds.contains(seat.getId()))
                .map(SeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SeatResponse> getBookedSeatsByScreening(Long screeningId) {
        // 확정된 예약만 조회
        List<Booking> confirmedBookings = bookingRepository.findByScreeningIdAndStatus(
                screeningId, Booking.BookingStatus.CONFIRMED);
        
        if (confirmedBookings.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 예약된 모든 좌석 조회
        List<BookingSeat> bookingSeats = confirmedBookings.stream()
                .flatMap(booking -> booking.getBookingSeats().stream())
                .collect(Collectors.toList());
        
        // 좌석 정보 변환
        return bookingSeats.stream()
                .map(bookingSeat -> {
                    SeatResponse response = SeatResponse.fromEntity(bookingSeat.getSeat());
                    response.setIsBooked(true); // 예약된 좌석으로 표시
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean isSeatAvailableForScreening(Long seatId, Long screeningId) {
        // 1. 좌석이 존재하는지 확인
        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + seatId));
        
        // 2. 좌석이 활성 상태인지 확인
        if (!seat.getIsActive()) {
            return false;
        }
        
        // 3. 해당 상영에 대해 예약된 좌석인지 확인
        List<Booking> confirmedBookings = bookingRepository.findByScreeningIdAndStatus(
                screeningId, Booking.BookingStatus.CONFIRMED);
        
        if (confirmedBookings.isEmpty()) {
            return true; // 예약이 없으면 좌석은 가용 상태
        }
        
        // 예약된 좌석 ID 목록에 포함되어 있는지 확인
        Set<Long> bookedSeatIds = confirmedBookings.stream()
                .flatMap(booking -> booking.getBookingSeats().stream())
                .map(bookingSeat -> bookingSeat.getSeat().getId())
                .collect(Collectors.toSet());
        
        return !bookedSeatIds.contains(seatId);
    }

    @Transactional(readOnly = true)
    public Map<Long, List<SeatResponse>> getSeatMapByScreenId(Long screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        
        // 좌석을 행(row)별로 그룹화
        return seats.stream()
                .map(SeatResponse::fromEntity)
                .collect(Collectors.groupingBy(
                        seatResponse -> (long) seatResponse.getSeatIdentifier().charAt(0)
                ));
    }

    @Transactional(readOnly = true)
    public SeatResponse getSeatById(Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + id));
        return SeatResponse.fromEntity(seat);
    }

    // 동시 예약 처리를 위한 락 기반 좌석 확보 메서드
    @Transactional
    public synchronized boolean lockSeatsForBooking(List<Long> seatIds, Long screeningId) {
        // 모든 좌석이 가용 상태인지 확인
        for (Long seatId : seatIds) {
            if (!isSeatAvailableForScreening(seatId, screeningId)) {
                return false; // 하나라도 이미 예약된 좌석이 있으면 실패
            }
        }
        
        // 실제 구현에서는 여기서 임시 예약 상태를 만들거나 Redis 등을 활용한 분산 락 구현 필요
        // 현재는 단일 서버 환경을 가정하고 synchronized 메서드로 간단히 구현
        
        return true; // 모든 좌석 락 성공
    }
    
    // 좌석 타입별 가격 정보 조회
    @Transactional(readOnly = true)
    public Map<String, Integer> getSeatTypePrices() {
        List<SeatType> seatTypes = seatTypeRepository.findAll();
        return seatTypes.stream()
                .collect(Collectors.toMap(
                        SeatType::getName,
                        SeatType::getPriceAdditional
                ));
    }
}
