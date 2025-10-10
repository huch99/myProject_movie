package com.moviesite.mysite.service;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.ReservationRequest;
import com.moviesite.mysite.model.dto.response.ReservationResponse;
import com.moviesite.mysite.model.entity.Reservation;
import com.moviesite.mysite.model.entity.Reservation.PaymentStatus;
import com.moviesite.mysite.model.entity.Reservation.ReservationStatus;
import com.moviesite.mysite.model.entity.ReservationSeat;
import com.moviesite.mysite.model.entity.Schedule;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.ReservationRepository;
import com.moviesite.mysite.repository.ReservationSeatRepository;
import com.moviesite.mysite.repository.ScheduleRepository;
import com.moviesite.mysite.repository.SeatRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final SeatRepository seatRepository;
    private final ReservationSeatRepository reservationSeatRepository;

    // 현재 로그인한 사용자의 모든 예매 내역 조회
    public Page<ReservationResponse> getMyReservations(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Reservation> reservations = reservationRepository.findByUserOrderByReservationTimeDesc(currentUser, pageable);
        return reservations.map(ReservationResponse::fromEntity);
    }

    // 관리자: 모든 사용자의 예매 내역 조회 (필터링 및 페이징)
    public Page<ReservationResponse> getAllReservations(String userName, String movieTitle, String status, Pageable pageable) {
        Specification<Reservation> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (userName != null && !userName.trim().isEmpty()) {
                Join<Reservation, User> userJoin = root.join("user");
                predicates.add(cb.like(userJoin.get("name"), "%" + userName + "%"));
            }
            if (movieTitle != null && !movieTitle.trim().isEmpty()) {
                Join<Reservation, Schedule> scheduleJoin = root.join("schedule");
                Join<Schedule, com.moviesite.mysite.model.entity.Movie> movieJoin = scheduleJoin.join("movie");
                predicates.add(cb.like(movieJoin.get("title"), "%" + movieTitle + "%"));
            }
            if (status != null && !status.trim().isEmpty()) {
                try {
                    ReservationStatus reservationStatus = ReservationStatus.valueOf(status.toUpperCase());
                    predicates.add(cb.equal(root.get("status"), reservationStatus));
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid reservation status: " + status);
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Reservation> reservations = reservationRepository.findAll(spec, pageable);
        return reservations.map(ReservationResponse::fromEntity);
    }

    // 특정 예매 상세 정보 조회
    public ReservationResponse getReservationById(Long id) {
        Reservation reservation = findReservationById(id);
        validateReservationOwnership(reservation);
        return ReservationResponse.fromEntity(reservation);
    }

    // 예매 생성
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        User currentUser = getCurrentUser();
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + request.getScheduleId()));

        // 상영 시간 검증
        if (schedule.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("이미 시작된 상영입니다");
        }
        
        // 좌석 유효성 검증
        List<Seat> selectedSeats = seatRepository.findAllById(request.getSeatIds());
        if (selectedSeats.size() != request.getSeatIds().size()) {
            throw new ResourceNotFoundException("유효하지 않은 좌석 ID가 포함되어 있습니다");
        }
        
        // 좌석 유효성 및 중복 예약 검증
        for (Seat seat : selectedSeats) {
            if (!seat.getScreen().getId().equals(schedule.getScreen().getId())) {
                throw new BadRequestException("선택된 좌석 중 상영관에 맞지 않는 좌석이 있습니다");
            }
            
            if (reservationSeatRepository.existsBySeatAndSchedule(seat, schedule)) {
                throw new BadRequestException("이미 예약된 좌석이 포함되어 있습니다");
            }
        }
        
        // 티켓 수량 확인
        if (request.getNumberOfTickets() != request.getSeatIds().size()) {
            throw new BadRequestException("티켓 수량과 선택된 좌석 수가 일치하지 않습니다");
        }

        // 총 결제 금액 계산
        BigDecimal pricePerTicket = BigDecimal.valueOf(schedule.getPrice());
        BigDecimal totalPrice = pricePerTicket.multiply(BigDecimal.valueOf(request.getNumberOfTickets()));

        // 예매 생성
        Reservation reservation = Reservation.builder()
                .user(currentUser)
                .schedule(schedule)
                .reservationTime(LocalDateTime.now())
                .totalPrice(totalPrice)
                .numberOfTickets(request.getNumberOfTickets())
                .status(ReservationStatus.CONFIRMED)
                .paymentStatus(PaymentStatus.PAID)
                .build();

        Reservation savedReservation = reservationRepository.save(reservation);

        // 좌석 예약 정보 저장
        List<ReservationSeat> reservationSeats = new ArrayList<>();
        for (Seat seat : selectedSeats) {
            ReservationSeat reservationSeat = ReservationSeat.builder()
                    .reservation(savedReservation)
                    .seat(seat)
                    .price(pricePerTicket)
                    .build();
            reservationSeats.add(reservationSeat);
        }
        reservationSeatRepository.saveAll(reservationSeats);

        return ReservationResponse.fromEntity(savedReservation);
    }

    // 예매 취소
    @Transactional
    public Map<String, String> cancelReservation(Long id) {
        Reservation reservation = findReservationById(id);
        validateReservationOwnership(reservation);

        if (!reservation.isCancelable()) {
            throw new BadRequestException("예매 취소 기한이 지났거나 취소할 수 없는 상태입니다");
        }
        
        if (reservation.getPaymentStatus() == PaymentStatus.REFUNDED) {
             throw new BadRequestException("이미 환불된 예매입니다");
        }

        // 예매 상태 변경
        reservation.setStatus(ReservationStatus.CANCELED);
        reservation.setPaymentStatus(PaymentStatus.REFUNDED);
        reservation.setUpdatedAt(LocalDateTime.now());
        reservationRepository.save(reservation);

        // 예약된 좌석 정보 삭제
        reservationSeatRepository.deleteByReservation(reservation);

        Map<String, String> result = new HashMap<>();
        result.put("status", "CANCELED");
        result.put("message", "예매가 성공적으로 취소되었습니다");
        return result;
    }
    
    // 예매 상태 변경 (관리자용)
    @Transactional
    public ReservationResponse updateReservationStatus(Long id, String status) {
        Reservation reservation = findReservationById(id);
        try {
            ReservationStatus newStatus = ReservationStatus.valueOf(status.toUpperCase());
            reservation.setStatus(newStatus);
            reservation.setUpdatedAt(LocalDateTime.now());
            Reservation updatedReservation = reservationRepository.save(reservation);
            return ReservationResponse.fromEntity(updatedReservation);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("유효하지 않은 예매 상태입니다: " + status);
        }
    }
    
    // 예매 통계 조회 (관리자용)
    public Map<String, Object> getReservationStatistics() {
        long totalReservations = reservationRepository.countByStatus(ReservationStatus.CONFIRMED);
        
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalConfirmedReservations", totalReservations);
        return statistics;
    }

    // 예매 엔티티 조회 (내부 메서드)
    private Reservation findReservationById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
    }

    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    // 예매 소유권 확인 (내부 메서드)
    private void validateReservationOwnership(Reservation reservation) {
        User currentUser = getCurrentUser();
        if (!currentUser.isAdmin() && !reservation.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("이 예매에 접근할 권한이 없습니다");
        }
    }
}