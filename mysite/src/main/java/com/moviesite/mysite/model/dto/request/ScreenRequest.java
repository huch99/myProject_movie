package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreenRequest {
    private Long theaterId;
    private String name;
    private String screenType; // "2D", "3D", "IMAX", "4DX", "SCREENX" 중 하나
    private Integer seatsRow;
    private Integer seatsColumn;
    
 // Getter 메서드
    public Long getTheaterId() {
        return theaterId;
    }

    public String getName() {
        return name;
    }

    public String getScreenType() {
        return screenType;
    }

    public Integer getSeatsRow() {
        return seatsRow;
    }

    public Integer getSeatsColumn() {
        return seatsColumn;
    }

    // Setter 메서드
    public void setTheaterId(Long theaterId) {
        this.theaterId = theaterId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setScreenType(String screenType) {
        this.screenType = screenType;
    }

    public void setSeatsRow(Integer seatsRow) {
        this.seatsRow = seatsRow;
    }

    public void setSeatsColumn(Integer seatsColumn) {
        this.seatsColumn = seatsColumn;
    }
}