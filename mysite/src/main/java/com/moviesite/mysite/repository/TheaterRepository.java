package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Theater;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, Long> {

	// 이름 또는 주소로 극장 검색 (페이징 처리)
    Page<Theater> findByNameContainingOrAddressContaining(String name, String address, Pageable pageable);
    
    // 지역별 극장 목록 조회
    List<Theater> findByLocationContaining(String location);
    
    // 특정 시설을 갖춘 극장 검색
    List<Theater> findByFacilitiesContaining(String facility);
    
    // 특정 특별관을 갖춘 극장 검색
    List<Theater> findBySpecialScreensContaining(String specialScreen);
    
    // 특정 영화를 상영 중인 극장 검색
    @Query("SELECT DISTINCT t FROM Theater t JOIN t.screens s JOIN Schedule sc ON sc.screen = s WHERE sc.movie.id = :movieId AND sc.status = 'OPEN'")
    List<Theater> findTheatersShowingMovie(@Param("movieId") Long movieId);
    
    // 특정 지역에서 특정 영화를 상영 중인 극장 검색
    @Query("SELECT DISTINCT t FROM Theater t JOIN t.screens s JOIN Schedule sc ON sc.screen = s WHERE sc.movie.id = :movieId AND t.location LIKE %:location% AND sc.status = 'OPEN'")
    List<Theater> findTheatersShowingMovieInLocation(@Param("movieId") Long movieId, @Param("location") String location);
    
    // 주차 시설이 있는 극장 검색
    @Query("SELECT t FROM Theater t WHERE t.parking IS NOT NULL AND t.parking != ''")
    List<Theater> findTheatersWithParking();
    
    // 특정 유형의 극장 검색
    List<Theater> findByType(String type);
    
    // 특정 수용 인원 이상의 극장 검색
    List<Theater> findByCapacityGreaterThanEqual(Integer capacity);
    
    // 이름으로 극장 존재 여부 확인
    boolean existsByName(String name);
    
    // 이름으로 극장 검색
    Theater findByName(String name);
    
    // 특정 기능을 갖춘 극장 검색
    List<Theater> findByFeaturesContaining(String feature);

	List<Theater> findByNameContainingOrLocationContainingOrAddressContaining(String keyword, String keyword2,
			String keyword3);

	Page<Theater> findByNameContainingAndLocationContaining(String name, String location, Pageable pageable);

	Page<Theater> findByNameContaining(String name, Pageable pageable);

	Page<Theater> findByLocationContaining(String location, Pageable pageable);
}
