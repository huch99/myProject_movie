package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Seat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SeatResponse {

    private Long seatId;
    private Long screenId;
    private String screenName;
    private String rowName;
    private Integer columnNumber;
    private String seatLabel;
    private String seatType;
    private Boolean isActive;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // Entity -> DTO 변환 메서드
    public static SeatResponse fromEntity(Seat seat) {
        if (seat == null) {
            return null;
        }

        return SeatResponse.builder()
                .seatId(seat.getId())
                .screenId(seat.getScreen().getId())
                .screenName(seat.getScreen().getName())
                .rowName(seat.getRowName())
                .columnNumber(seat.getColumnNumber())
                .seatLabel(seat.getSeatLabel())
                .seatType(seat.getSeatType().name())
                .isActive(seat.getIsActive())
                .createdAt(seat.getCreatedAt())
                .build();
    }
}