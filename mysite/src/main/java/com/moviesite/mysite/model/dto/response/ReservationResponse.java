package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Reservation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservationResponse {
    
    private Long reservationId;
    private Long userId;
    private String userName;
    private Long scheduleId;
    
    // 영화 정보
    private Long movieId;
    private String movieTitle;
    private String posterUrl;
    
    // 극장/상영관 정보
    private Long theaterId;
    private String theaterName;
    private String screenName;
    
    // 상영 정보
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime screeningTime;
    private String formattedScreeningTime;
    
    // 예약 정보
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime reservationTime;
    private String formattedReservationTime;
    private BigDecimal totalPrice;
    private Integer numberOfTickets;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private List<String> selectedSeats;
    private boolean cancelable;
    private boolean confirmed;
    
    // Entity -> DTO 변환 메서드
    public static ReservationResponse fromEntity(Reservation reservation) {
        if (reservation == null) {
            return null;
        }
        
        return ReservationResponse.builder()
                .reservationId(reservation.getId())
                .userId(reservation.getUser().getId())
                .userName(reservation.getUser().getName())
                .scheduleId(reservation.getSchedule().getId())
                .movieId(reservation.getSchedule().getMovie().getId())
                .movieTitle(reservation.getSchedule().getMovie().getTitle())
                .posterUrl(reservation.getSchedule().getMovie().getPosterUrl())
                .theaterId(reservation.getSchedule().getScreen().getTheater().getId())
                .theaterName(reservation.getSchedule().getScreen().getTheater().getName())
                .screenName(reservation.getSchedule().getScreen().getName())
                .screeningTime(reservation.getSchedule().getStartTime())
                .formattedScreeningTime(reservation.getSchedule().getStartTime() != null ?
                        reservation.getSchedule().getStartTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .reservationTime(reservation.getReservationTime())
                .formattedReservationTime(reservation.getReservationTime() != null ?
                        reservation.getReservationTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .totalPrice(reservation.getTotalPrice())
                .numberOfTickets(reservation.getNumberOfTickets())
                .status(reservation.getStatus().name())
                .paymentMethod(reservation.getPaymentMethod())
                .paymentStatus(reservation.getPaymentStatus().name())
                .cancelable(reservation.isCancelable())
                .confirmed(reservation.isConfirmed())
                .build();
    }
}
