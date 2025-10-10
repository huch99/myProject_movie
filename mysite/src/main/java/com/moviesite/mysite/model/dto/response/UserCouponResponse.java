package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.UserCoupon;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserCouponResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long couponId;
    private String couponName;
    private String couponCode;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime issueDate;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryDate;

    private String formattedIssueDate;
    private String formattedExpiryDate;
    private Boolean used;
    private Boolean expired;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime usedDate;

    private String formattedUsedDate;
    private Long reservationId;

    // Entity -> DTO 변환 메서드
    public static UserCouponResponse fromEntity(UserCoupon userCoupon) {
        if (userCoupon == null) {
            return null;
        }

        return UserCouponResponse.builder()
                .id(userCoupon.getId())
                .userId(userCoupon.getUser().getId())
                .userName(userCoupon.getUser().getName())
                .couponId(userCoupon.getCoupon().getId())
                .couponName(userCoupon.getCoupon().getName())
                .issueDate(userCoupon.getIssueDate())
                .expiryDate(userCoupon.getExpiryDate())
                .formattedIssueDate(userCoupon.getIssueDate() != null ?
                        userCoupon.getIssueDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .formattedExpiryDate(userCoupon.getExpiryDate() != null ?
                        userCoupon.getExpiryDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .used(userCoupon.getUsed())
                .expired(userCoupon.getExpired())
                .usedDate(userCoupon.getUsedDate())
                .formattedUsedDate(userCoupon.getUsedDate() != null ?
                        userCoupon.getUsedDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .reservationId(userCoupon.getReservationId())
                .build();
    }
}