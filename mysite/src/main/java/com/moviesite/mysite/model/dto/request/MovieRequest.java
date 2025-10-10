package com.moviesite.mysite.model.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {
	
	@NotBlank(message = "영화 제목은 필수 입력 항목입니다")
    @Size(max = 100, message = "영화 제목은 100자를 초과할 수 없습니다")
    private String title;
    
    @Size(max = 100, message = "영문 제목은 100자를 초과할 수 없습니다")
    private String titleEn;
    
    @Size(max = 50, message = "감독명은 50자를 초과할 수 없습니다")
    private String director;
    
    @Size(max = 500, message = "배우 목록은 500자를 초과할 수 없습니다")
    private String actors; // 쉼표로 구분된 문자열
    
    @NotBlank(message = "장르는 필수 입력 항목입니다")
    @Size(max = 100, message = "장르는 100자를 초과할 수 없습니다")
    private String genre; // 쉼표로 구분된 문자열
    
    @NotNull(message = "상영 시간은 필수 입력 항목입니다")
    @Min(value = 1, message = "상영 시간은 1분 이상이어야 합니다")
    private Integer runningTime;
    
    @NotNull(message = "개봉일은 필수 입력 항목입니다")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate releaseDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    
    @NotNull(message = "평점은 필수 입력 항목입니다")
    @DecimalMin(value = "0.0", message = "평점은 0.0 이상이어야 합니다")
    @DecimalMax(value = "10.0", message = "평점은 10.0 이하여야 합니다")
    private BigDecimal rating;
    
    @Size(max = 2000, message = "시놉시스는 2000자를 초과할 수 없습니다")
    private String synopsis;
    
    private String posterUrl;
    
    private String backgroundUrl;
    
    private String trailerUrl;
    
    @NotBlank(message = "상태는 필수 입력 항목입니다")
    private String status; // "COMING_SOON", "NOW_PLAYING", "ENDED" 등
    
    @NotBlank(message = "관람 등급은 필수 입력 항목입니다")
    @Size(max = 10, message = "관람 등급은 10자를 초과할 수 없습니다")
    private String ageRating; // "전체", "12세", "15세", "청소년", "19세" 등
    
}
