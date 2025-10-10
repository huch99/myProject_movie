package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Movie.MovieStatus;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

	// 상영 상태별 영화 목록 조회
    List<Movie> findByStatus(Movie.MovieStatus status);
    
    // 제목 또는 감독으로 영화 검색 (페이징 처리)
    Page<Movie> findByTitleContainingOrDirectorContaining(String title, String director, Pageable pageable);
    
    // 장르로 영화 검색
    List<Movie> findByGenreContaining(String genre);
    
    // 개봉일 기준으로 영화 검색
    List<Movie> findByReleaseDateBetween(LocalDate startDate, LocalDate endDate);
    
    // 평점 기준으로 영화 검색
    List<Movie> findByRatingGreaterThanEqual(Double rating);
    
    // 현재 상영중 + 평점 높은순 정렬
    List<Movie> findByStatusOrderByRatingDesc(Movie.MovieStatus status);
    
    // 비슷한 영화 찾기 (같은 장르이면서 ID가 다른 영화 중 평점 순으로)
    @Query("SELECT m FROM Movie m WHERE m.genre LIKE %:genre% AND m.id != :movieId ORDER BY m.rating DESC")
    List<Movie> findSimilarMovies(@Param("genre") String genre, @Param("movieId") Long movieId, Pageable pageable);
    
    // 오버로딩 - 결과 수 제한 버전
    @Query("SELECT m FROM Movie m WHERE m.genre LIKE %:genre% AND m.id != :movieId ORDER BY m.rating DESC")
    List<Movie> findSimilarMovies(@Param("genre") String genre, @Param("movieId") Long movieId, @Param("limit") int limit);
    
    // 개봉 예정작 중 가장 가까운 개봉일 순으로 조회
    @Query("SELECT m FROM Movie m WHERE m.status = 'COMING_SOON' AND m.releaseDate > CURRENT_DATE ORDER BY m.releaseDate ASC")
    List<Movie> findUpcomingMovies(Pageable pageable);
    
    // 특정 배우가 출연한 영화 목록
    @Query("SELECT m FROM Movie m WHERE m.actors LIKE %:actor%")
    List<Movie> findByActor(@Param("actor") String actor);
    
    // 최근 추가된 영화 목록
    List<Movie> findTop10ByOrderByCreatedAtDesc();
    
    // 특정 연령 등급의 영화 목록
    List<Movie> findByAgeRating(String ageRating);
    
    // 제목으로 영화 존재 여부 확인
    boolean existsByTitle(String title);

	Page<Movie> findByTitleContainingAndStatus(String title, MovieStatus valueOf, Pageable pageable);

	Page<Movie> findByTitleContaining(String title, Pageable pageable);

	Page<Movie> findByStatus(MovieStatus valueOf, Pageable pageable);

	List<Movie> findByStatusAndReleaseDateLessThanEqualAndEndDateGreaterThanEqual(MovieStatus nowShowing,
			LocalDate today, LocalDate today2);

	List<Movie> findByStatusAndReleaseDateGreaterThan(MovieStatus comingSoon, LocalDate today);

	List<Movie> findByTitleContainingOrTitleEnContainingOrDirectorContaining(String keyword, String keyword2,
			String keyword3);

	List<Movie> findByStatusAndReleaseDateLessThanEqual(MovieStatus comingSoon, LocalDate today);

	List<Movie> findByStatusAndEndDateLessThan(MovieStatus nowShowing, LocalDate today);

	List<Movie> findByGenreContainingAndStatus(String genre, MovieStatus nowShowing);

	List<Movie> findByDirectorContaining(String director);

	List<Movie> findPopularMovies(int limit);
}
