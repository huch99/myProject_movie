package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.ReservationSeatRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.ReservationSeatResponse;
import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.ReservationSeat;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.ReservationRepository;
import com.moviesite.mysite.repository.ReservationSeatRepository;
import com.moviesite.mysite.repository.SeatRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationSeatService {

    private final ReservationSeatRepository reservationSeatRepository;
    private final ReservationRepository reservationRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    // 특정 예매의 좌석 정보 조회
    public List<ReservationSeatResponse> getReservationSeatsByReservationId(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        
        // 예매 소유자 확인
        validateReservationOwnership(reservation);
        
        List<ReservationSeat> reservationSeats = reservationSeatRepository.findByReservation(reservation);
        return reservationSeats.stream()
                .map(ReservationSeatResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 좌석 예약 추가
    @Transactional
    public ReservationSeatResponse addReservationSeat(ReservationSeatRequest request) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + request.getReservationId()));
        
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new ResourceNotFoundException("Seat not found with id: " + request.getSeatId()));
        
        // 예매 소유자 확인
        validateReservationOwnership(reservation);
        
        // 이미 예약된 좌석인지 확인
        if (reservationSeatRepository.existsBySeatAndReservationSchedule(seat, reservation.getSchedule())) {
            throw new BadRequestException("이미 예약된 좌석입니다");
        }
        
        ReservationSeat reservationSeat = ReservationSeat.builder()
                .reservation(reservation)
                .seat(seat)
                .price(request.getPrice())
                .build();
        
        ReservationSeat savedReservationSeat = reservationSeatRepository.save(reservationSeat);
        return ReservationSeatResponse.fromEntity(savedReservationSeat);
    }

    // 좌석 예약 삭제
    @Transactional
    public void deleteReservationSeat(Long id) {
        ReservationSeat reservationSeat = reservationSeatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation seat not found with id: " + id));
        
        // 예매 소유자 확인
        validateReservationOwnership(reservationSeat.getReservation());
        
        reservationSeatRepository.delete(reservationSeat);
    }
    
    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    // 예매 소유권 확인
    private void validateReservationOwnership(Reservation reservation) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !reservation.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("해당 예매에 접근할 권한이 없습니다");
        }
    }
}