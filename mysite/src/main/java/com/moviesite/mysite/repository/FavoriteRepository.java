package com.moviesite.mysite.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Favorite;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

	// 특정 사용자의 모든 즐겨찾기 조회
    List<Favorite> findByUserId(Long userId);
    
    // 특정 사용자의 영화 즐겨찾기 조회
    List<Favorite> findByUserIdAndFavoriteType(Long userId, Favorite.FavoriteType favoriteType);
    
    // 특정 사용자의 특정 영화 즐겨찾기 조회
    Optional<Favorite> findByUserIdAndMovieId(Long userId, Long movieId);
    
    // 특정 사용자의 특정 극장 즐겨찾기 조회
    Optional<Favorite> findByUserIdAndTheaterId(Long userId, Long theaterId);
    
    // 특정 영화를 즐겨찾기한 사용자 수 조회
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.movie.id = :movieId")
    Long countByMovieId(@Param("movieId") Long movieId);
    
    // 특정 극장을 즐겨찾기한 사용자 수 조회
    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.theater.id = :theaterId")
    Long countByTheaterId(@Param("theaterId") Long theaterId);
    
    // 특정 사용자가 특정 영화를 즐겨찾기했는지 확인
    boolean existsByUserIdAndMovieId(Long userId, Long movieId);
    
    // 특정 사용자가 특정 극장을 즐겨찾기했는지 확인
    boolean existsByUserIdAndTheaterId(Long userId, Long theaterId);
    
    // 가장 많이 즐겨찾기된 영화 목록 조회
    @Query("SELECT f.movie.id, f.movie.title, COUNT(f) as count FROM Favorite f WHERE f.favoriteType = 'MOVIE' GROUP BY f.movie.id, f.movie.title ORDER BY count DESC")
    List<Object[]> findMostFavoritedMovies(Pageable pageable);
    
    // 가장 많이 즐겨찾기된 극장 목록 조회
    @Query("SELECT f.theater.id, f.theater.name, COUNT(f) as count FROM Favorite f WHERE f.favoriteType = 'THEATER' GROUP BY f.theater.id, f.theater.name ORDER BY count DESC")
    List<Object[]> findMostFavoritedTheaters(Pageable pageable);
    
    // 특정 사용자의 즐겨찾기 삭제
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    
    void deleteByUserIdAndTheaterId(Long userId, Long theaterId);
}
