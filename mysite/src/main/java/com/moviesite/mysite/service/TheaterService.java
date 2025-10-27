package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;

import org.hibernate.service.spi.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.TheaterRequest;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.model.entity.Theater;
import com.moviesite.mysite.repository.TheaterRepository;

import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TheaterService {

	private final TheaterRepository theaterRepository;
    private final FileService fileService;
    
    private static final Logger log = LoggerFactory.getLogger(TheaterService.class);

    // 모든 극장 목록 조회 (페이징 처리)
    public Page<TheaterResponse> getAllTheaters(String name, String location, Pageable pageable) {
        Page<Theater> theaters;
        
        if (name != null && location != null) {
            theaters = theaterRepository.findByNameContainingAndLocationContaining(name, location, pageable);
        } else if (name != null) {
            theaters = theaterRepository.findByNameContaining(name, pageable);
        } else if (location != null) {
            theaters = theaterRepository.findByLocationContaining(location, pageable);
        } else {
            theaters = theaterRepository.findAll(pageable);
        }
        
        return theaters.map(TheaterResponse::fromEntity);
    }

    // 지역별 극장 목록 조회
    public List<TheaterResponse> getTheatersByLocation(String location) {
        List<Theater> theaters = theaterRepository.findByLocationContaining(location);
        
        return theaters.stream()
                .map(TheaterResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 극장 상세 정보 조회
    public TheaterResponse getTheaterById(Long theaterId) {
    	try {
    		Theater theater = findTheaterById(theaterId);
    		if (theater == null) {
    			throw new EntityNotFoundException("ID가 " + theaterId + "인 극장을 찾을 수 없습니다.");
    		}
    		return TheaterResponse.fromEntity(theater);
    	} catch (Exception e) {
    		throw new ServiceException("극장 정보를 조회하는 중 오류가 발생했습니다.", e);
    	}
//        Theater theater = findTheaterById(theaterId);
//        return TheaterResponse.fromEntity(theater);
    }

    // 극장 검색
    public List<TheaterResponse> searchTheaters(String keyword) {
        List<Theater> theaters = theaterRepository.findByNameContainingOrLocationContainingOrAddressContaining(
                keyword, keyword, keyword);
        
        return theaters.stream()
                .map(TheaterResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특수 상영관이 있는 극장 목록 조회
    public List<TheaterResponse> getTheatersWithSpecialScreens(String screenType) {
        List<Theater> theaters = theaterRepository.findBySpecialScreensContaining(screenType);
        
        return theaters.stream()
                .map(TheaterResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 극장 등록
    @Transactional
    public TheaterResponse createTheater(TheaterRequest theaterRequest) {
        Theater theater = new Theater();
        updateTheaterFromRequest(theater, theaterRequest);
        
        // 생성 시간 설정
        theater.setCreatedAt(LocalDateTime.now());
        theater.setUpdatedAt(LocalDateTime.now());
        
        Theater savedTheater = theaterRepository.save(theater);
        return TheaterResponse.fromEntity(savedTheater);
    }

    // 극장 정보 수정
    @Transactional
    public TheaterResponse updateTheater(Long id, TheaterRequest theaterRequest) {
        Theater theater = findTheaterById(id);
        updateTheaterFromRequest(theater, theaterRequest);
        
        // 업데이트 시간 설정
        theater.setUpdatedAt(LocalDateTime.now());
        
        Theater updatedTheater = theaterRepository.save(theater);
        return TheaterResponse.fromEntity(updatedTheater);
    }

    // 극장 삭제
    @Transactional
    public void deleteTheater(Long id) {
        if (!theaterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Theater not found with id: " + id);
        }
        
        // 극장 이미지 파일 삭제
        Theater theater = findTheaterById(id);
        if (theater.getImageUrl() != null) {
            fileService.deleteFile(theater.getImageUrl());
        }
        
        theaterRepository.deleteById(id);
    }

    // 극장 이미지 업로드
    @Transactional
    public TheaterResponse uploadTheaterImage(Long id, MultipartFile file) {
        Theater theater = findTheaterById(id);
        
        // 기존 이미지 삭제
        if (theater.getImageUrl() != null) {
            fileService.deleteFile(theater.getImageUrl());
        }
        
        // 새 이미지 업로드
        String imageUrl = fileService.storeFile(file, "theaters");
        theater.setImageUrl(imageUrl);
        
        // 업데이트 시간 설정
        theater.setUpdatedAt(LocalDateTime.now());
        
        Theater updatedTheater = theaterRepository.save(theater);
        return TheaterResponse.fromEntity(updatedTheater);
    }
    
    // 극장 엔티티 조회 (내부 메서드)
    private Theater findTheaterById(Long theaterId) {
        return theaterRepository.findById(theaterId)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + theaterId));
    }
    
    // 극장 엔티티 업데이트 (내부 메서드)
    private void updateTheaterFromRequest(Theater theater, TheaterRequest request) {
        theater.setName(request.getName());
        theater.setLocation(request.getLocation());
        theater.setAddress(request.getAddress());
        theater.setContact(request.getContact());
        theater.setPhone(request.getPhone());
        theater.setFacilities(request.getFacilities());
        theater.setSpecialScreens(request.getSpecialScreens());
        theater.setDescription(request.getDescription());
        theater.setFeatures(request.getFeatures());
        theater.setParking(request.getParking());
        theater.setTransportation(request.getTransportation());
        theater.setCapacity(request.getCapacity());
        theater.setType(request.getType());
        
        // URL 정보는 null이 아닌 경우에만 업데이트 (파일 업로드 메서드에서 별도로 처리될 수 있으므로)
        if (request.getImageUrl() != null) {
            theater.setImageUrl(request.getImageUrl());
        }
    }
}
