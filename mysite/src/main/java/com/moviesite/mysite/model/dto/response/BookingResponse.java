package com.moviesite.mysite.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.moviesite.mysite.model.entity.Booking;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
	private Long id;
	private String bookingNumber;
	private Long userId;
	private String username;
	private Long screeningId;
	private String movieTitle;
	private String theaterName;
	private String screenName;
	private LocalDateTime startTime;
	private Integer totalSeats;
	private Integer totalPrice;
	private String status;
	private LocalDateTime bookingDate;
	private List<BookingSeatResponse> bookedSeats;
	private PaymentResponse payment;

	public static BookingResponse fromEntity(Booking booking) {
		List<BookingSeatResponse> bookedSeats = booking.getBookingSeats().stream().map(BookingSeatResponse::fromEntity)
				.collect(Collectors.toList());

		PaymentResponse paymentResponse = null;
		if (booking.getPayment() != null) {
			paymentResponse = PaymentResponse.fromEntity(booking.getPayment());
		}

		BookingResponse response = new BookingResponse();
		response.setId(booking.getId());
		response.setBookingNumber(booking.getBookingNumber());
		response.setUserId(booking.getUser().getId());
		response.setUsername(booking.getUser().getUsername());
		response.setScreeningId(booking.getScreening().getId());
		response.setMovieTitle(booking.getScreening().getMovie().getTitle());
		response.setTheaterName(booking.getScreening().getScreen().getTheater().getName());
		response.setScreenName(booking.getScreening().getScreen().getName());
		response.setStartTime(booking.getScreening().getStartTime());
		response.setTotalSeats(booking.getTotalSeats());
		response.setTotalPrice(booking.getTotalPrice());
		response.setStatus(booking.getStatus().name());
		response.setBookingDate(booking.getBookingDate());
		response.setBookedSeats(bookedSeats);
		response.setPayment(paymentResponse);
		return response;
	}
	
	// Getter 메서드
	public Long getId() {
	    return id;
	}

	public String getBookingNumber() {
	    return bookingNumber;
	}

	public Long getUserId() {
	    return userId;
	}

	public String getUsername() {
	    return username;
	}

	public Long getScreeningId() {
	    return screeningId;
	}

	public String getMovieTitle() {
	    return movieTitle;
	}

	public String getTheaterName() {
	    return theaterName;
	}

	public String getScreenName() {
	    return screenName;
	}

	public LocalDateTime getStartTime() {
	    return startTime;
	}

	public Integer getTotalSeats() {
	    return totalSeats;
	}

	public Integer getTotalPrice() {
	    return totalPrice;
	}

	public String getStatus() {
	    return status;
	}

	public LocalDateTime getBookingDate() {
	    return bookingDate;
	}

	public List<BookingSeatResponse> getBookedSeats() {
	    return bookedSeats;
	}

	public PaymentResponse getPayment() {
	    return payment;
	}

	// Setter 메서드
	public void setId(Long id) {
	    this.id = id;
	}

	public void setBookingNumber(String bookingNumber) {
	    this.bookingNumber = bookingNumber;
	}

	public void setUserId(Long userId) {
	    this.userId = userId;
	}

	public void setUsername(String username) {
	    this.username = username;
	}

	public void setScreeningId(Long screeningId) {
	    this.screeningId = screeningId;
	}

	public void setMovieTitle(String movieTitle) {
	    this.movieTitle = movieTitle;
	}

	public void setTheaterName(String theaterName) {
	    this.theaterName = theaterName;
	}

	public void setScreenName(String screenName) {
	    this.screenName = screenName;
	}

	public void setStartTime(LocalDateTime startTime) {
	    this.startTime = startTime;
	}

	public void setTotalSeats(Integer totalSeats) {
	    this.totalSeats = totalSeats;
	}

	public void setTotalPrice(Integer totalPrice) {
	    this.totalPrice = totalPrice;
	}

	public void setStatus(String status) {
	    this.status = status;
	}

	public void setBookingDate(LocalDateTime bookingDate) {
	    this.bookingDate = bookingDate;
	}

	public void setBookedSeats(List<BookingSeatResponse> bookedSeats) {
	    this.bookedSeats = bookedSeats;
	}

	public void setPayment(PaymentResponse payment) {
	    this.payment = payment;
	}
}
