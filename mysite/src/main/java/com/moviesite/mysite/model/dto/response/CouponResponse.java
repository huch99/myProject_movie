package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Coupon;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CouponResponse {

	private Long couponId;
	private String couponCode;
	private String name;
	private String description;
	private String discountType; // "PERCENT" 또는 "AMOUNT"
	private BigDecimal discountValue;
	private BigDecimal minOrderPrice;
	private BigDecimal maxDiscountAmount;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime issueDate;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime expiryDate;

	private String formattedIssueDate;
	private String formattedExpiryDate;

	private Integer usageLimitPerUser;
	private Integer totalUsageLimit;
	private String couponType; // "GENERAL", "WELCOME", "EVENT", "MOVIE_SPECIFIC", "THEATER_SPECIFIC"

	// 영화 특정 쿠폰인 경우
	private Long targetMovieId;
	private String targetMovieTitle;

	// 극장 특정 쿠폰인 경우
	private Long targetTheaterId;
	private String targetTheaterName;

	private String status; // "ACTIVE", "EXPIRED", "DISABLED"
	private Boolean isValid;

	// Entity -> DTO 변환 메서드
	public static CouponResponse fromEntity(Coupon coupon) {
		if (coupon == null) {
			return null;
		}

		return CouponResponse.builder().couponId(coupon.getId()).couponCode(coupon.getCouponCode())
				.name(coupon.getName()).description(coupon.getDescription())
				.discountType(coupon.getDiscountType().name()).discountValue(coupon.getDiscountValue())
				.minOrderPrice(coupon.getMinOrderPrice()).maxDiscountAmount(coupon.getMaxDiscountAmount())
				.issueDate(coupon.getIssueDate()).expiryDate(coupon.getExpiryDate())
				.formattedIssueDate(coupon.getIssueDate() != null
						? coupon.getIssueDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"))
						: null)
				.formattedExpiryDate(coupon.getExpiryDate() != null
						? coupon.getExpiryDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"))
						: null)
				.usageLimitPerUser(coupon.getUsageLimitPerUser()).totalUsageLimit(coupon.getTotalUsageLimit())
				.couponType(coupon.getCouponType().name())
				.targetMovieId(coupon.getTargetMovie() != null ? coupon.getTargetMovie().getId() : null)
				.targetMovieTitle(coupon.getTargetMovie() != null ? coupon.getTargetMovie().getTitle() : null)
				.targetTheaterId(coupon.getTargetTheater() != null ? coupon.getTargetTheater().getId() : null)
				.targetTheaterName(coupon.getTargetTheater() != null ? coupon.getTargetTheater().getName() : null)
				.status(coupon.getStatus().name()).isValid(coupon.isValid()).build();
	}
}
