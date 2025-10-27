package com.moviesite.mysite.service;

import com.moviesite.mysite.model.dto.request.ScreenRequest;
import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.response.ScreenResponse;
import com.moviesite.mysite.model.dto.response.TheaterResponse;
import com.moviesite.mysite.model.entity.Screen;
import com.moviesite.mysite.model.entity.Theater;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.ScreenRepository;
import com.moviesite.mysite.repository.TheaterRepository;
import com.moviesite.mysite.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScreenService {

	private final ScreenRepository screenRepository;
	private final TheaterRepository theaterRepository;
	private final UserRepository userRepository;

	// 특정 극장의 모든 상영관 조회
	public List<ScreenResponse> getScreensByTheaterId(Long theaterId) {
		try {
			List<Screen> screens = screenRepository.findByTheater_Id(theaterId);
			return screens.stream().map(ScreenResponse::fromEntity).collect(Collectors.toList());
		} catch (Exception e) {
			throw new RuntimeException("극장 ID로 상영관 조회 중 서비스 오류 발생", e);
		}

	}

	// 특정 상영관 상세 조회
	public ScreenResponse getScreenById(Long id) {
		Screen screen = findScreenById(id);
		return ScreenResponse.fromEntity(screen);
	}

	// 상영관 생성 (관리자용)
	@Transactional
	public ScreenResponse createScreen(ScreenRequest request) {
		// 관리자 권한 확인
		User currentUser = getAuthenticatedUser();
		if (!currentUser.isAdmin()) {
			throw new BadRequestException("관리자만 접근 가능합니다");
		}

		// 극장 존재 여부 확인
		Theater theater = theaterRepository.findById(request.getTheaterId()).orElseThrow(
				() -> new ResourceNotFoundException("Theater not found with id: " + request.getTheaterId()));

		// 행과 열 수가 좌석 수와 일치하는지 확인
		if (request.getRowCount() * request.getColumnCount() != request.getSeatsCount()) {
			throw new BadRequestException("행 수와 열 수의 곱은 좌석 수와 일치해야 합니다");
		}

		// 상영관 생성
		Screen screen = Screen.builder().theater(theater).name(request.getName()).type(request.getType())
				.seatsCount(request.getSeatsCount()).rowCount(request.getRowCount())
				.columnCount(request.getColumnCount()).screenSize(request.getScreenSize())
				.audioSystem(request.getAudioSystem()).isAccessible(request.getIsAccessible()).build();

		Screen savedScreen = screenRepository.save(screen);
		return ScreenResponse.fromEntity(savedScreen);
	}

	// 상영관 수정 (관리자용)
	@Transactional
	public ScreenResponse updateScreen(Long id, ScreenRequest request) {
		// 관리자 권한 확인
		User currentUser = getAuthenticatedUser();
		if (!currentUser.isAdmin()) {
			throw new BadRequestException("관리자만 접근 가능합니다");
		}

		Screen screen = findScreenById(id);

		// 극장 존재 여부 확인
		Theater theater = theaterRepository.findById(request.getTheaterId()).orElseThrow(
				() -> new ResourceNotFoundException("Theater not found with id: " + request.getTheaterId()));

		// 행과 열 수가 좌석 수와 일치하는지 확인
		if (request.getRowCount() * request.getColumnCount() != request.getSeatsCount()) {
			throw new BadRequestException("행 수와 열 수의 곱은 좌석 수와 일치해야 합니다");
		}

		// 상영관 정보 업데이트
		screen.setTheater(theater);
		screen.setName(request.getName());
		screen.setType(request.getType());
		screen.setSeatsCount(request.getSeatsCount());
		screen.setRowCount(request.getRowCount());
		screen.setColumnCount(request.getColumnCount());
		screen.setScreenSize(request.getScreenSize());
		screen.setAudioSystem(request.getAudioSystem());
		screen.setIsAccessible(request.getIsAccessible());
		screen.setUpdatedAt(LocalDateTime.now());

		Screen updatedScreen = screenRepository.save(screen);
		return ScreenResponse.fromEntity(updatedScreen);
	}

	// 상영관 삭제 (관리자용)
	@Transactional
	public void deleteScreen(Long id) {
		// 관리자 권한 확인
		User currentUser = getAuthenticatedUser();
		if (!currentUser.isAdmin()) {
			throw new BadRequestException("관리자만 접근 가능합니다");
		}

		Screen screen = findScreenById(id);
		screenRepository.delete(screen);
	}

	// 상영관 엔티티 조회 (내부 메서드)
	private Screen findScreenById(Long id) {
		return screenRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Screen not found with id: " + id));
	}

	// 현재 로그인한 사용자 조회
	private User getAuthenticatedUser() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String email = authentication.getName();

		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
	}

	public Page<ScreenResponse> getAllScreens(String name, Pageable pageable) {
		Page<Screen> screens;

		if (name != null && !name.trim().isEmpty()) {
			screens = screenRepository.findByNameContaining(name, pageable);
		} else {
			screens = screenRepository.findAll(pageable);
		}
		return screens.map(ScreenResponse::fromEntity);
	}
}