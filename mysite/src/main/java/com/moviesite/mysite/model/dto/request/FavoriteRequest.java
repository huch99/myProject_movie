package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteRequest {

	@NotNull(message = "즐겨찾기 유형은 필수 입력 항목입니다")
    private String favoriteType; // "MOVIE" 또는 "THEATER"
    
    // 영화 즐겨찾기인 경우
    private Long movieId;
    
    // 극장 즐겨찾기인 경우
    private Long theaterId;
}
