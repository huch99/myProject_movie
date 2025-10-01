package com.moviesite.mysite.model.dto.response;

import com.moviesite.mysite.model.entity.BookingSeat;

public class BookingSeatResponse {
	private Long id;
    private Long seatId;
    private String seatIdentifier; // A1, B2
    private String seatType;
    private Integer price; // 이 좌석에 대해 지불된 최종 가격

    public static BookingSeatResponse fromEntity(BookingSeat bookingSeat) {
        BookingSeatResponse response = new BookingSeatResponse();
        response.setId(bookingSeat.getId());
        response.setSeatId(bookingSeat.getSeat().getId());
        response.setSeatIdentifier(String.valueOf(bookingSeat.getSeat().getSeatRow()) + bookingSeat.getSeat().getSeatNumber());
        response.setSeatType(bookingSeat.getSeat().getSeatType().getName());
        response.setPrice(bookingSeat.getPrice());
        return response;
    }
    
 // Getter 메서드
    public Long getId() {
        return id;
    }

    public Long getSeatId() {
        return seatId;
    }

    public String getSeatIdentifier() {
        return seatIdentifier;
    }

    public String getSeatType() {
        return seatType;
    }

    public Integer getPrice() {
        return price;
    }

    // Setter 메서드
    public void setId(Long id) {
        this.id = id;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public void setSeatIdentifier(String seatIdentifier) {
        this.seatIdentifier = seatIdentifier;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
