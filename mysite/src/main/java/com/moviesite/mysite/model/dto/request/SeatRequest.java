package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatRequest {
    private Long screenId;
    private Character seatRow;
    private Integer seatNumber;
    private Long seatTypeId;
    private Boolean isActive;
    
 // Getter 메서드
    public Long getScreenId() {
        return screenId;
    }

    public Character getSeatRow() {
        return seatRow;
    }

    public Integer getSeatNumber() {
        return seatNumber;
    }

    public Long getSeatTypeId() {
        return seatTypeId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    // Setter 메서드
    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }

    public void setSeatRow(Character seatRow) {
        this.seatRow = seatRow;
    }

    public void setSeatNumber(Integer seatNumber) {
        this.seatNumber = seatNumber;
    }

    public void setSeatTypeId(Long seatTypeId) {
        this.seatTypeId = seatTypeId;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}