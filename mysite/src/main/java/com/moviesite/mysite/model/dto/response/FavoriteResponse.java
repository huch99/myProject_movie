package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Favorite;
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
public class FavoriteResponse {

	private Long favoriteId;
    private Long userId;
    private String userName;
    private String favoriteType; // "MOVIE" 또는 "THEATER"
    
    // 영화 즐겨찾기인 경우
    private Long movieId;
    private String movieTitle;
    private String moviePosterUrl;
    private String movieReleaseDate;
    
    // 극장 즐겨찾기인 경우
    private Long theaterId;
    private String theaterName;
    private String theaterLocation;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    private String formattedCreatedAt;
    
    // Entity -> DTO 변환 메서드
    public static FavoriteResponse fromEntity(Favorite favorite) {
        if (favorite == null) {
            return null;
        }
        
        FavoriteResponseBuilder builder = FavoriteResponse.builder()
                .favoriteId(favorite.getId())
                .userId(favorite.getUser().getId())
                .userName(favorite.getUser().getName())
                .favoriteType(favorite.getFavoriteType().name())
                .createdAt(favorite.getCreatedAt())
                .formattedCreatedAt(favorite.getCreatedAt() != null ?
                        favorite.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null);
        
        // 영화 즐겨찾기인 경우
        if (favorite.isMovieFavorite() && favorite.getMovie() != null) {
            builder.movieId(favorite.getMovie().getId())
                   .movieTitle(favorite.getMovie().getTitle())
                   .moviePosterUrl(favorite.getMovie().getPosterUrl())
                   .movieReleaseDate(favorite.getMovie().getReleaseDate() != null ?
                           favorite.getMovie().getReleaseDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : null);
        }
        
        // 극장 즐겨찾기인 경우
        if (favorite.isTheaterFavorite() && favorite.getTheater() != null) {
            builder.theaterId(favorite.getTheater().getId())
                   .theaterName(favorite.getTheater().getName())
                   .theaterLocation(favorite.getTheater().getLocation());
        }
        
        return builder.build();
    }
}
