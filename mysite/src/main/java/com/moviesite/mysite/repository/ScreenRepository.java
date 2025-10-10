package com.moviesite.mysite.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Screen;

import java.util.List;

@Repository
public interface ScreenRepository extends JpaRepository<Screen, Long> {

	// 특정 극장의 모든 상영관 조회
    List<Screen> findByTheaterId(Long theaterId);
    
    // 특정 극장의 모든 상영관 조회 (페이징 처리)
    Page<Screen> findByTheaterId(Long theaterId, Pageable pageable);
    
    // 특정 타입의 상영관 조회
    List<Screen> findByType(String type);
    
    // 특정 극장에서 특정 타입의 상영관 조회
    List<Screen> findByTheaterIdAndType(Long theaterId, String type);
    
    // 특정 좌석 수 이상의 상영관 조회
    List<Screen> findBySeatsCountGreaterThanEqual(Integer seatsCount);
    
    // 특정 상영관 이름으로 조회
    Screen findByTheaterIdAndName(Long theaterId, String name);
    
    // 특정 상영관 이름 존재 여부 확인
    boolean existsByTheaterIdAndName(Long theaterId, String name);
    
    // 특정 극장의 상영관 수 조회
    @Query("SELECT COUNT(s) FROM Screen s WHERE s.theater.id = :theaterId")
    Long countByTheaterId(@Param("theaterId") Long theaterId);
    
    // 특정 극장의 장애인 접근 가능한 상영관 조회
    List<Screen> findByTheaterIdAndIsAccessibleTrue(Long theaterId);
    
    // 특정 오디오 시스템을 갖춘 상영관 조회
    List<Screen> findByAudioSystemContaining(String audioSystem);
    
    // 특정 스크린 크기를 갖춘 상영관 조회
    List<Screen> findByScreenSizeContaining(String screenSize);
    
    // 특정 극장에서 가장 큰 좌석 수를 가진 상영관 조회
    @Query("SELECT s FROM Screen s WHERE s.theater.id = :theaterId ORDER BY s.seatsCount DESC")
    List<Screen> findLargestScreenByTheaterId(@Param("theaterId") Long theaterId, Pageable pageable);
}
