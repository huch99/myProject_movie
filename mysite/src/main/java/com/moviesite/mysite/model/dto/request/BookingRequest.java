package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {
    private Long screeningId;
    private List<Long> seatIds;
    
 // Getter 메서드
    public Long getScreeningId() {
        return screeningId;
    }

    public List<Long> getSeatIds() {
        return seatIds;
    }

    // Setter 메서드
    public void setScreeningId(Long screeningId) {
        this.screeningId = screeningId;
    }

    public void setSeatIds(List<Long> seatIds) {
        this.seatIds = seatIds;
    }
}