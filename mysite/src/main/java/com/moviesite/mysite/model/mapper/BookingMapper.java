package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.response.BookingResponse;
import com.moviesite.mysite.model.dto.response.BookingSeatResponse;
import com.moviesite.mysite.model.entity.Booking;

@Component
public class BookingMapper {
	private final BookingSeatMapper bookingSeatMapper;
    private final PaymentMapper paymentMapper;
    
    public BookingMapper(BookingSeatMapper bookingSeatMapper, PaymentMapper paymentMapper) {
        this.bookingSeatMapper = bookingSeatMapper;
        this.paymentMapper = paymentMapper;
    }
    
    public BookingResponse toResponse(Booking booking) {
        // Builder 대신 일반 객체 생성 방식 사용
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setBookingNumber(booking.getBookingNumber());
        response.setUserId(booking.getUser().getId());
        response.setUsername(booking.getUser().getUsername());
        response.setScreeningId(booking.getScreening().getId());
        response.setMovieTitle(booking.getScreening().getMovie().getTitle());
        response.setTheaterName(booking.getScreening().getScreen().getTheater().getName());
        response.setScreenName(booking.getScreening().getScreen().getName());
        response.setStartTime(booking.getScreening().getStartTime());
        response.setTotalSeats(booking.getTotalSeats());
        response.setTotalPrice(booking.getTotalPrice());
        response.setStatus(booking.getStatus().name());
        response.setBookingDate(booking.getBookingDate());
        
        // 예약된 좌석 정보 설정
        if (booking.getBookingSeats() != null && !booking.getBookingSeats().isEmpty()) {
            List<BookingSeatResponse> bookingSeatResponses = booking.getBookingSeats().stream()
                    .map(bookingSeatMapper::toResponse)
                    .collect(Collectors.toList());
            response.setBookedSeats(bookingSeatResponses);
        }
        
        // 결제 정보 설정
        if (booking.getPayment() != null) {
            response.setPayment(paymentMapper.toResponse(booking.getPayment()));
        }
        
        return response;
    }
    
    public List<BookingResponse> toResponseList(List<Booking> bookings) {
        return bookings.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
