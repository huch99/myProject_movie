package com.moviesite.mysite.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List; // 장르나 배우 리스트를 담을 수 있습니다.

import com.moviesite.mysite.model.entity.Movie;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {

	private Long movieId;
    private String title;
    private String titleEn;
    private String director;
    private List<String> actors;
    private List<String> genres;
    private Integer runningTime;
    private LocalDate releaseDate;
    private LocalDate endDate;
    private String formattedReleaseDate;
    private String formattedEndDate;
    private BigDecimal rating;
    private String synopsis;
    private String posterUrl;
    private String backgroundUrl;
    private String trailerUrl;
    private String status;
    private String ageRating;

    // Entity -> DTO 변환 메서드
    public static MovieResponse fromEntity(Movie movie) {
        if (movie == null) {
            return null;
        }

        return MovieResponse.builder()
        	    .movieId(movie.getId())
        	    .title(movie.getTitle())
        	    .titleEn(movie.getTitleEn())
        	    .synopsis(movie.getSynopsis())
        	    .releaseDate(movie.getReleaseDate())
        	    .formattedReleaseDate(movie.getReleaseDate() != null ?
        	            movie.getReleaseDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")) : null)
        	    .posterUrl(movie.getPosterUrl())
        	    .backgroundUrl(movie.getBackgroundUrl())
        	    .trailerUrl(movie.getTrailerUrl())
        	    .runningTime(movie.getRunningTime())
        	    .rating(movie.getRating()) // BigDecimal 값을 문자열로 변환
        	    .genres(movie.getGenreList()) // 이미 만들어둔 편의 메서드 활용
        	    .director(movie.getDirector())
        	    .actors(movie.getActorsList()) // 이미 만들어둔 편의 메서드 활용
        	    .ageRating(movie.getAgeRating())
        	    .status(movie.getStatus().name()) // Enum 값의 이름을 문자열로 변환
        	    .endDate(movie.getEndDate())
        	    .build();
    }
}
