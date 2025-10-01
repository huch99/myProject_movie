package com.moviesite.mysite.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.moviesite.mysite.model.dto.request.SeatRequest;
import com.moviesite.mysite.model.dto.response.SeatResponse;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Seat;
import com.moviesite.mysite.model.entity.SeatType;

@Component
public class SeatMapper {
	
	public SeatResponse toResponse(Seat seat) {
	    SeatResponse response = new SeatResponse();
	    response.setId(seat.getId());
	    response.setScreenId(seat.getScreen().getId());
	    response.setSeatIdentifier(String.valueOf(seat.getSeatRow()) + seat.getSeatNumber());
	    response.setSeatType(seat.getSeatType().getName());
	    response.setPriceAdditional(seat.getSeatType().getPriceAdditional());
	    response.setIsActive(seat.getIsActive());
	    response.setIsBooked(false); // 기본값은 false, 서비스 로직에서 실제 예약 여부에 따라 설정
	    return response;
	}

	public List<SeatResponse> toResponseList(List<Seat> seats) {
	    return seats.stream()
	            .map(this::toResponse)
	            .collect(Collectors.toList());
	}

	public Seat toEntity(SeatRequest request, Screen screen, SeatType seatType) {
	    Seat seat = new Seat();
	    seat.setScreen(screen);
	    seat.setSeatRow(request.getSeatRow());
	    seat.setSeatNumber(request.getSeatNumber());
	    seat.setSeatType(seatType);
	    seat.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
	    return seat;
	}
}
