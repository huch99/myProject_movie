package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.FavoriteRequest;
import com.moviesite.mysite.model.dto.response.FavoriteResponse;
import com.moviesite.mysite.model.entity.Favorite;
import com.moviesite.mysite.model.entity.Favorite.FavoriteType;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Theater;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.repository.FavoriteRepository;
import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.TheaterRepository;
import com.moviesite.mysite.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

	private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    // 현재 로그인한 사용자의 모든 즐겨찾기 조회
    public Map<String, Object> getMyFavorites() {
        User currentUser = getCurrentUser();
        
        List<Favorite> favorites = favoriteRepository.findByUserId(currentUser.getId());
        
        // 영화 즐겨찾기와 극장 즐겨찾기 분리
        List<FavoriteResponse> favoriteMovies = favorites.stream()
                .filter(Favorite::isMovieFavorite)
                .map(FavoriteResponse::fromEntity)
                .collect(Collectors.toList());
        
        List<FavoriteResponse> favoriteTheaters = favorites.stream()
                .filter(Favorite::isTheaterFavorite)
                .map(FavoriteResponse::fromEntity)
                .collect(Collectors.toList());
        
        Map<String, Object> result = new HashMap<>();
        result.put("movies", favoriteMovies);
        result.put("theaters", favoriteTheaters);
        
        return result;
    }

    // 현재 로그인한 사용자의 영화 즐겨찾기 조회
    public List<FavoriteResponse> getMyFavoriteMovies() {
        User currentUser = getCurrentUser();
        
        List<Favorite> favorites = favoriteRepository.findByUserIdAndFavoriteType(
                currentUser.getId(), FavoriteType.MOVIE);
        
        return favorites.stream()
                .map(FavoriteResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 현재 로그인한 사용자의 극장 즐겨찾기 조회
    public List<FavoriteResponse> getMyFavoriteTheaters() {
        User currentUser = getCurrentUser();
        
        List<Favorite> favorites = favoriteRepository.findByUserIdAndFavoriteType(
                currentUser.getId(), FavoriteType.THEATER);
        
        return favorites.stream()
                .map(FavoriteResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 즐겨찾기 추가
    @Transactional
    public FavoriteResponse addFavorite(FavoriteRequest favoriteRequest) {
        User currentUser = getCurrentUser();
        
        Favorite favorite = new Favorite();
        favorite.setUser(currentUser);
        favorite.setFavoriteType(FavoriteType.valueOf(favoriteRequest.getFavoriteType()));
        
        // 영화 즐겨찾기인 경우
        if (favorite.getFavoriteType() == FavoriteType.MOVIE) {
            if (favoriteRequest.getMovieId() == null) {
                throw new BadRequestException("영화 ID는 필수 입력 항목입니다");
            }
            
            Movie movie = movieRepository.findById(favoriteRequest.getMovieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + favoriteRequest.getMovieId()));
            
            // 이미 즐겨찾기에 추가된 영화인지 확인
            if (favoriteRepository.existsByUserIdAndMovieId(currentUser.getId(), movie.getId())) {
                throw new BadRequestException("이미 즐겨찾기에 추가된 영화입니다");
            }
            
            favorite.setMovie(movie);
        }
        
        // 극장 즐겨찾기인 경우
        if (favorite.getFavoriteType() == FavoriteType.THEATER) {
            if (favoriteRequest.getTheaterId() == null) {
                throw new BadRequestException("극장 ID는 필수 입력 항목입니다");
            }
            
            Theater theater = theaterRepository.findById(favoriteRequest.getTheaterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + favoriteRequest.getTheaterId()));
            
            // 이미 즐겨찾기에 추가된 극장인지 확인
            if (favoriteRepository.existsByUserIdAndTheaterId(currentUser.getId(), theater.getId())) {
                throw new BadRequestException("이미 즐겨찾기에 추가된 극장입니다");
            }
            
            favorite.setTheater(theater);
        }
        
        Favorite savedFavorite = favoriteRepository.save(favorite);
        return FavoriteResponse.fromEntity(savedFavorite);
    }

    // 영화 즐겨찾기 추가/삭제 토글
    @Transactional
    public Map<String, Object> toggleMovieFavorite(Long movieId) {
        User currentUser = getCurrentUser();
        
        // 영화 존재 여부 확인
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + movieId));
        
        // 이미 즐겨찾기에 추가된 영화인지 확인
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserIdAndMovieId(currentUser.getId(), movieId);
        
        Map<String, Object> result = new HashMap<>();
        
        if (existingFavorite.isPresent()) {
            // 즐겨찾기 삭제
            favoriteRepository.delete(existingFavorite.get());
            result.put("favorite", false);
            result.put("message", "영화가 즐겨찾기에서 삭제되었습니다");
        } else {
            // 즐겨찾기 추가
            Favorite favorite = new Favorite();
            favorite.setUser(currentUser);
            favorite.setMovie(movie);
            favorite.setFavoriteType(FavoriteType.MOVIE);
            
            Favorite savedFavorite = favoriteRepository.save(favorite);
            
            result.put("favorite", true);
            result.put("favoriteId", savedFavorite.getId());
            result.put("message", "영화가 즐겨찾기에 추가되었습니다");
        }
        
        return result;
    }

    // 극장 즐겨찾기 추가/삭제 토글
    @Transactional
    public Map<String, Object> toggleTheaterFavorite(Long theaterId) {
        User currentUser = getCurrentUser();
        
        // 극장 존재 여부 확인
        Theater theater = theaterRepository.findById(theaterId)
                .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + theaterId));
        
        // 이미 즐겨찾기에 추가된 극장인지 확인
        Optional<Favorite> existingFavorite = favoriteRepository.findByUserIdAndTheaterId(currentUser.getId(), theaterId);
        
        Map<String, Object> result = new HashMap<>();
        
        if (existingFavorite.isPresent()) {
            // 즐겨찾기 삭제
            favoriteRepository.delete(existingFavorite.get());
            result.put("favorite", false);
            result.put("message", "극장이 즐겨찾기에서 삭제되었습니다");
        } else {
            // 즐겨찾기 추가
            Favorite favorite = new Favorite();
            favorite.setUser(currentUser);
            favorite.setTheater(theater);
            favorite.setFavoriteType(FavoriteType.THEATER);
            
            Favorite savedFavorite = favoriteRepository.save(favorite);
            
            result.put("favorite", true);
            result.put("favoriteId", savedFavorite.getId());
            result.put("message", "극장이 즐겨찾기에 추가되었습니다");
        }
        
        return result;
    }

    // 특정 영화가 즐겨찾기에 추가되었는지 확인
    public Map<String, Boolean> checkMovieFavorite(Long movieId) {
        User currentUser = getCurrentUser();
        boolean isFavorite = favoriteRepository.existsByUserIdAndMovieId(currentUser.getId(), movieId);
        
        return Map.of("favorite", isFavorite);
    }

    // 특정 극장이 즐겨찾기에 추가되었는지 확인
    public Map<String, Boolean> checkTheaterFavorite(Long theaterId) {
        User currentUser = getCurrentUser();
        boolean isFavorite = favoriteRepository.existsByUserIdAndTheaterId(currentUser.getId(), theaterId);
        
        return Map.of("favorite", isFavorite);
    }

    // 즐겨찾기 삭제
    @Transactional
    public void deleteFavorite(Long id) {
        Favorite favorite = favoriteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found with id: " + id));
        
        // 현재 사용자가 즐겨찾기 소유자인지 확인
        User currentUser = getCurrentUser();
        if (!favorite.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("이 즐겨찾기를 삭제할 권한이 없습니다");
        }
        
        favoriteRepository.delete(favorite);
    }
    
    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
