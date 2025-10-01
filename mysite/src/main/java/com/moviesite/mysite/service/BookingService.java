package com.moviesite.mysite.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.repository.BookingRepository;
import com.moviesite.mysite.repository.BookingSeatRepository;
import com.moviesite.mysite.repository.ScreeningRepository;
import com.moviesite.mysite.repository.SeatRepository;
import com.moviesite.mysite.repository.UserRepository;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.BookingRequest;
import com.moviesite.mysite.model.dto.response.*;
import com.moviesite.mysite.model.entity.Booking;
import com.moviesite.mysite.model.entity.Booking.BookingStatus;
import com.moviesite.mysite.model.entity.BookingSeat;
import com.moviesite.mysite.model.entity.Screening;
import com.moviesite.mysite.model.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
	private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final UserRepository userRepository;
    private final ScreeningRepository screeningRepository;
    private final SeatRepository seatRepository;

    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        // 현재 인증된 사용자가 자신의 예매를 조회하는 경우 or ADMIN 권한인 경우만 허용
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!booking.getUser().getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to view this booking.");
        }
        return BookingResponse.fromEntity(booking);
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
        Screening screening = screeningRepository.findById(request.getScreeningId())
                .orElseThrow(() -> new ResourceNotFoundException("Screening not found with id: " + request.getScreeningId()));

        if (request.getSeatIds().isEmpty()) {
            throw new BadRequestException("At least one seat must be selected for booking.");
        }

        // 선택된 좌석 유효성 및 중복 확인
        List<Seat> selectedSeats = seatRepository.findAllById(request.getSeatIds());
        if (selectedSeats.size() != request.getSeatIds().size()) {
            throw new BadRequestException("One or more selected seats are invalid.");
        }

        // 이미 예약된 좌석인지 확인
        List<BookingSeat> existingBookingsForScreening = bookingSeatRepository.findByBooking_ScreeningId(screening.getId());
        List<Long> bookedSeatIds = existingBookingsForScreening.stream()
                .filter(bs -> bs.getBooking().getStatus() != BookingStatus.CANCELLED) // 취소되지 않은 예약만
                .map(bs -> bs.getSeat().getId())
                .collect(Collectors.toList());

        for (Long seatId : request.getSeatIds()) {
            if (bookedSeatIds.contains(seatId)) {
                throw new BadRequestException("Seat with id " + seatId + " is already booked for this screening.");
            }
        }
        
        int totalCalculatedPrice = 0;
        for (Seat seat : selectedSeats) {
            totalCalculatedPrice += screening.getBasePrice() + seat.getSeatType().getPriceAdditional();
        }

        String bookingNumber = generateBookingNumber();

        Booking booking = Booking.builder()
                .bookingNumber(bookingNumber)
                .user(user)
                .screening(screening)
                .totalSeats(request.getSeatIds().size())
                .totalPrice(totalCalculatedPrice)
                .status(BookingStatus.PENDING) // 초기에는 결제 대기 상태
                .bookingDate(LocalDateTime.now())
                .build();
        Booking savedBooking = bookingRepository.save(booking);

        List<BookingSeat> bookingSeats = selectedSeats.stream().map(seat ->
                BookingSeat.builder()
                        .booking(savedBooking)
                        .seat(seat)
                        .price(screening.getBasePrice() + seat.getSeatType().getPriceAdditional())
                        .build()
        ).collect(Collectors.toList());
        bookingSeatRepository.saveAll(bookingSeats);

        // TODO: 여기에서 PaymentService 호출하여 결제 처리 유도 (현재는 PENDING 상태로만 만듦)
        // 실제 구현에서는 이 부분에서 결제 시스템으로 리디렉션하거나 결제 정보 입력을 받습니다.

        return BookingResponse.fromEntity(savedBooking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        // 현재 인증된 사용자가 자신의 예매를 취소하는 경우 or ADMIN 권한인 경우만 허용
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!booking.getUser().getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to cancel this booking.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking is already cancelled.");
        }
        
        // 상영 시작 시간 임박 시 취소 불가능 로직 추가
        if (booking.getScreening().getStartTime().isBefore(LocalDateTime.now().plusMinutes(30))) { // 예: 상영 30분 전까지 취소 가능
            throw new BadRequestException("Cannot cancel booking within 30 minutes of screening start time.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking canceledBooking = bookingRepository.save(booking);

        // TODO: 결제 취소 (환불) 로직 연동
        // PaymentService.refundPayment(booking.getPayment().getId()); 등을 호출해야 합니다.

        return BookingResponse.fromEntity(canceledBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsByUser(Long userId) {
        // 본인 정보만 조회 가능하도록 권한 확인 필요
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
        
        if (!currentUser.getId().equals(userId) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to view other users' bookings.");
        }

        return bookingRepository.findByUserId(userId).stream()
                .map(BookingResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByNumber(String bookingNumber) {
        Booking booking = bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with number: " + bookingNumber));

        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!booking.getUser().getUsername().equals(currentUsername) &&
            !SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new BadRequestException("You do not have permission to view this booking.");
        }
        return BookingResponse.fromEntity(booking);
    }

    private String generateBookingNumber() {
        return "BKG" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }
}
