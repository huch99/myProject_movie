package com.moviesite.mysite.model.dto.response;

import com.moviesite.mysite.model.entity.Seat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeatResponse {
	private Long id;
    private Long screenId;
    private String seatIdentifier; // A1, B2 와 같이 조합된 형태
    private String seatType;
    private Integer priceAdditional;
    private Boolean isActive; // 사용 가능한 좌석인지 여부
    private Boolean isBooked; // 현재 상영회차에서 예매된 좌석인지 여부 (Service에서 설정)

    public static SeatResponse fromEntity(Seat seat) {
    	SeatResponse seatResponse = new SeatResponse();
    	seatResponse.setId(seat.getId());
    	seatResponse.setScreenId(seat.getScreen().getId());
    	seatResponse.setSeatIdentifier(String.valueOf(seat.getSeatRow()) + seat.getSeatNumber());
    	seatResponse.setSeatType(seat.getSeatType().getName());
    	seatResponse.setPriceAdditional(seat.getSeatType().getPriceAdditional());
    	seatResponse.setIsActive(seat.getIsActive());
    	seatResponse.setIsBooked(false); // 기본값은 false, 서비스 로직에서 실제 예약 여부에 따라 설정
    	return seatResponse;
    }
    
 // 기본 생성자
    public SeatResponse() {}
    
    // 전체 필드 생성자
    public SeatResponse(Long id, Long screenId, String seatIdentifier, 
                       String seatType, Integer priceAdditional, 
                       Boolean isActive, Boolean isBooked) {
        this.id = id;
        this.screenId = screenId;
        this.seatIdentifier = seatIdentifier;
        this.seatType = seatType;
        this.priceAdditional = priceAdditional;
        this.isActive = isActive;
        this.isBooked = isBooked;
    }
    
    // Getter 메서드
    public Long getId() {
        return id;
    }
    
    public Long getScreenId() {
        return screenId;
    }
    
    public String getSeatIdentifier() {
        return seatIdentifier;
    }
    
    public String getSeatType() {
        return seatType;
    }
    
    public Integer getPriceAdditional() {
        return priceAdditional;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public Boolean getIsBooked() {
        return isBooked;
    }
    
    // Setter 메서드
    public void setId(Long id) {
        this.id = id;
    }
    
    public void setScreenId(Long screenId) {
        this.screenId = screenId;
    }
    
    public void setSeatIdentifier(String seatIdentifier) {
        this.seatIdentifier = seatIdentifier;
    }
    
    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }
    
    public void setPriceAdditional(Integer priceAdditional) {
        this.priceAdditional = priceAdditional;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
    
    // isActive() 메서드 (filter에서 사용 가능)
    public boolean isActive() {
        return isActive != null && isActive;
    }
    
    // isBooked() 메서드 (filter에서 사용 가능)
    public boolean isBooked() {
        return isBooked != null && isBooked;
    }
}
