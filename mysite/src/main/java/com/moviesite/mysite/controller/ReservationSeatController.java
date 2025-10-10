package com.moviesite.mysite.controller;

import com.moviesite.mysite.model.dto.request.ReservationSeatRequest;
import com.moviesite.mysite.model.dto.response.ApiResponse;
import com.moviesite.mysite.model.dto.response.ReservationSeatResponse;
import com.moviesite.mysite.service.ReservationSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/reservation-seats")
@RequiredArgsConstructor
public class ReservationSeatController {

    private final ReservationSeatService reservationSeatService;

    // 특정 예매의 좌석 정보 조회
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<ApiResponse<List<ReservationSeatResponse>>> getReservationSeatsByReservationId(@PathVariable Long reservationId) {
        List<ReservationSeatResponse> reservationSeats = reservationSeatService.getReservationSeatsByReservationId(reservationId);
        return ResponseEntity.ok(ApiResponse.success(reservationSeats));
    }

    // 좌석 예약 추가
    @PostMapping
    public ResponseEntity<ApiResponse<ReservationSeatResponse>> addReservationSeat(@Valid @RequestBody ReservationSeatRequest request) {
        ReservationSeatResponse createdReservationSeat = reservationSeatService.addReservationSeat(request);
        return new ResponseEntity<>(ApiResponse.success("좌석이 성공적으로 예약되었습니다.", createdReservationSeat), HttpStatus.CREATED);
    }

    // 좌석 예약 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReservationSeat(@PathVariable Long id) {
        reservationSeatService.deleteReservationSeat(id);
        return ResponseEntity.ok(ApiResponse.success("좌석 예약이 성공적으로 삭제되었습니다.", null));
    }
}