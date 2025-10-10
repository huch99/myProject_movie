package com.moviesite.mysite.model.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {

	@NotBlank(message = "쿠폰 코드는 필수 입력 항목입니다")
    @Size(min = 5, max = 20, message = "쿠폰 코드는 5~20자 사이여야 합니다")
    @Pattern(regexp = "^[A-Z0-9-_]+$", message = "쿠폰 코드는 대문자, 숫자, 하이픈, 언더스코어만 사용 가능합니다")
    private String couponCode;
    
    @NotBlank(message = "쿠폰 이름은 필수 입력 항목입니다")
    @Size(max = 100, message = "쿠폰 이름은 100자를 초과할 수 없습니다")
    private String name;
    
    @Size(max = 500, message = "쿠폰 설명은 500자를 초과할 수 없습니다")
    private String description;
    
    @NotBlank(message = "할인 유형은 필수 입력 항목입니다")
    @Pattern(regexp = "^(PERCENT|AMOUNT)$", message = "할인 유형은 PERCENT 또는 AMOUNT여야 합니다")
    private String discountType;
    
    @NotNull(message = "할인 값은 필수 입력 항목입니다")
    @DecimalMin(value = "0.01", message = "할인 값은 0보다 커야 합니다")
    private BigDecimal discountValue;
    
    private BigDecimal minOrderPrice;
    
    private BigDecimal maxDiscountAmount;
    
    @NotNull(message = "발행 일시는 필수 입력 항목입니다")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime issueDate;
    
    @NotNull(message = "만료 일시는 필수 입력 항목입니다")
    @Future(message = "만료 일시는 미래 시간이어야 합니다")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryDate;
    
    private Integer usageLimitPerUser;
    
    private Integer totalUsageLimit;
    
    @NotBlank(message = "쿠폰 유형은 필수 입력 항목입니다")
    @Pattern(regexp = "^(GENERAL|WELCOME|EVENT|MOVIE_SPECIFIC|THEATER_SPECIFIC)$", 
            message = "쿠폰 유형은 GENERAL, WELCOME, EVENT, MOVIE_SPECIFIC, THEATER_SPECIFIC 중 하나여야 합니다")
    private String couponType;
    
    private Long targetMovieId;
    
    private Long targetTheaterId;
    
    @NotBlank(message = "쿠폰 상태는 필수 입력 항목입니다")
    @Pattern(regexp = "^(ACTIVE|EXPIRED|DISABLED)$", 
            message = "쿠폰 상태는 ACTIVE, EXPIRED, DISABLED 중 하나여야 합니다")
    private String status;
}
