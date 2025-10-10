package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.ReservationSeat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationSeatResponse {
    
    private Long id;
    private Long reservationId;
    private Long seatId;
    private String seatLabel;
    private String seatRow;
    private String seatColumn;
    private BigDecimal price;
    private String screenName;
    private LocalDateTime createdAt;
    
    // Entity -> DTO 변환 메서드
    public static ReservationSeatResponse fromEntity(ReservationSeat reservationSeat) {
        if (reservationSeat == null) {
            return null;
        }
        
        return ReservationSeatResponse.builder()
                .id(reservationSeat.getId())
                .reservationId(reservationSeat.getReservation().getId())
                .seatId(reservationSeat.getSeat().getId())
                .seatLabel(reservationSeat.getSeatInfo())
                .price(reservationSeat.getPrice())
                .screenName(reservationSeat.getSeat().getScreen().getName())
                .createdAt(reservationSeat.getCreatedAt())
                .build();
    }
}