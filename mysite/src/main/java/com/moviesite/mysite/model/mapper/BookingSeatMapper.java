package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.response.BookingSeatResponse;
import com.moviesite.mysite.model.entity.BookingSeat;

@Component
public class BookingSeatMapper {
	public BookingSeatResponse toResponse(BookingSeat bookingSeat) {
	    BookingSeatResponse response = new BookingSeatResponse();
	    response.setId(bookingSeat.getId());
	    response.setSeatId(bookingSeat.getSeat().getId());
	    response.setSeatIdentifier(String.valueOf(bookingSeat.getSeat().getSeatRow()) + bookingSeat.getSeat().getSeatNumber());
	    response.setSeatType(bookingSeat.getSeat().getSeatType().getName());
	    response.setPrice(bookingSeat.getPrice());
	    return response;
	}
    
    public List<BookingSeatResponse> toResponseList(List<BookingSeat> bookingSeats) {
        return bookingSeats.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
}
