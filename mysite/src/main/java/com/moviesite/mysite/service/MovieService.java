package com.moviesite.mysite.service;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.MovieRequest;
import com.moviesite.mysite.model.dto.response.MovieResponse;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Movie.MovieStatus;
import com.moviesite.mysite.repository.MovieRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieService {

	private final MovieRepository movieRepository;
    private final FileService fileService;

    // 모든 영화 목록 조회 (페이징 처리)
    public Page<MovieResponse> getAllMovies(String title, String status, Pageable pageable) {
        Page<Movie> movies;
        
        if (title != null && status != null) {
            movies = movieRepository.findByTitleContainingAndStatus(title, MovieStatus.valueOf(status), pageable);
        } else if (title != null) {
            movies = movieRepository.findByTitleContaining(title, pageable);
        } else if (status != null) {
            movies = movieRepository.findByStatus(MovieStatus.valueOf(status), pageable);
        } else {
            movies = movieRepository.findAll(pageable);
        }
        
        return movies.map(MovieResponse::fromEntity);
    }

    // 현재 상영 중인 영화 목록 조회
    public List<MovieResponse> getNowPlayingMovies() {
        LocalDate today = LocalDate.now();
        List<Movie> movies = movieRepository.findByStatusAndReleaseDateLessThanEqualAndEndDateGreaterThanEqual(
                MovieStatus.NOW_SHOWING, today, today);
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 상영 예정 영화 목록 조회
    public List<MovieResponse> getUpcomingMovies() {
        LocalDate today = LocalDate.now();
        List<Movie> movies = movieRepository.findByStatusAndReleaseDateGreaterThan(
                MovieStatus.COMING_SOON, today);
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 특정 영화 상세 정보 조회
    public MovieResponse getMovieById(Long id) {
        Movie movie = findMovieById(id);
        return MovieResponse.fromEntity(movie);
    }

    // 영화 검색
    public List<MovieResponse> searchMovies(String keyword) {
        List<Movie> movies = movieRepository.findByTitleContainingOrTitleEnContainingOrDirectorContaining(
                keyword, keyword, keyword);
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // 영화 등록
    @Transactional
    public MovieResponse createMovie(MovieRequest movieRequest) {
        Movie movie = new Movie();
        updateMovieFromRequest(movie, movieRequest);
        
        // 생성 시간 설정
        movie.setCreatedAt(LocalDateTime.now());
        movie.setUpdatedAt(LocalDateTime.now());
        
        Movie savedMovie = movieRepository.save(movie);
        return MovieResponse.fromEntity(savedMovie);
    }

    // 영화 수정
    @Transactional
    public MovieResponse updateMovie(Long id, MovieRequest movieRequest) {
        Movie movie = findMovieById(id);
        updateMovieFromRequest(movie, movieRequest);
        
        // 업데이트 시간 설정
        movie.setUpdatedAt(LocalDateTime.now());
        
        Movie updatedMovie = movieRepository.save(movie);
        return MovieResponse.fromEntity(updatedMovie);
    }

    // 영화 삭제
    @Transactional
    public void deleteMovie(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Movie not found with id: " + id);
        }
        
        // 영화 포스터 및 배경 이미지 파일 삭제
        Movie movie = findMovieById(id);
        if (movie.getPosterUrl() != null) {
            fileService.deleteFile(movie.getPosterUrl());
        }
        
        if (movie.getBackgroundUrl() != null) {
            fileService.deleteFile(movie.getBackgroundUrl());
        }
        
        movieRepository.deleteById(id);
    }

    // 영화 포스터 업로드
    @Transactional
    public MovieResponse uploadPoster(Long id, MultipartFile file) {
        Movie movie = findMovieById(id);
        
        // 기존 포스터 삭제
        if (movie.getPosterUrl() != null) {
            fileService.deleteFile(movie.getPosterUrl());
        }
        
        // 새 포스터 업로드
        String posterUrl = fileService.uploadMoviePoster(file);
        movie.setPosterUrl(posterUrl);
        
        // 업데이트 시간 설정
        movie.setUpdatedAt(LocalDateTime.now());
        
        Movie updatedMovie = movieRepository.save(movie);
        return MovieResponse.fromEntity(updatedMovie);
    }

    // 배경 이미지 업로드
    @Transactional
    public MovieResponse uploadBackgroundImage(Long id, MultipartFile file) {
        Movie movie = findMovieById(id);
        
        // 기존 배경 이미지 삭제
        if (movie.getBackgroundUrl() != null) {
            fileService.deleteFile(movie.getBackgroundUrl());
        }
        
        // 새 배경 이미지 업로드
        String backgroundUrl = fileService.storeFile(file, "backgrounds");
        movie.setBackgroundUrl(backgroundUrl);
        
        // 업데이트 시간 설정
        movie.setUpdatedAt(LocalDateTime.now());
        
        Movie updatedMovie = movieRepository.save(movie);
        return MovieResponse.fromEntity(updatedMovie);
    }
    
    // 영화 엔티티 조회 (내부 메서드)
    private Movie findMovieById(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
    }
    
 // 영화 엔티티 업데이트 (내부 메서드)
    private void updateMovieFromRequest(Movie movie, MovieRequest request) {
        movie.setTitle(request.getTitle());
        movie.setTitleEn(request.getTitleEn());
        movie.setDirector(request.getDirector());
        movie.setActors(request.getActors());
        movie.setGenre(request.getGenre());
        movie.setRunningTime(request.getRunningTime());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setEndDate(request.getEndDate());
        movie.setRating(request.getRating());
        movie.setSynopsis(request.getSynopsis());
        
        // URL 정보는 null이 아닌 경우에만 업데이트 (파일 업로드 메서드에서 별도로 처리될 수 있으므로)
        if (request.getPosterUrl() != null) {
            movie.setPosterUrl(request.getPosterUrl());
        }
        
        if (request.getBackgroundUrl() != null) {
            movie.setBackgroundUrl(request.getBackgroundUrl());
        }
        
        if (request.getTrailerUrl() != null) {
            movie.setTrailerUrl(request.getTrailerUrl());
        }
        
        // 상태 업데이트
        if (request.getStatus() != null) {
            movie.setStatus(MovieStatus.valueOf(request.getStatus()));
        }
        
        movie.setAgeRating(request.getAgeRating());
    }
    
    // 개봉일 기준으로 영화 상태 자동 업데이트 (스케줄러에서 호출)
    @Transactional
    public void updateMovieStatusByDate() {
        LocalDate today = LocalDate.now();
        
        // 개봉 예정 -> 상영 중으로 변경
        List<Movie> upcomingMovies = movieRepository.findByStatusAndReleaseDateLessThanEqual(
                MovieStatus.COMING_SOON, today);
        
        for (Movie movie : upcomingMovies) {
            movie.setStatus(MovieStatus.NOW_SHOWING);
            movie.setUpdatedAt(LocalDateTime.now());
        }
        
        // 상영 중 -> 상영 종료로 변경
        List<Movie> playingMovies = movieRepository.findByStatusAndEndDateLessThan(
                MovieStatus.NOW_SHOWING, today);
        
        for (Movie movie : playingMovies) {
            movie.setStatus(MovieStatus.ENDED);
            movie.setUpdatedAt(LocalDateTime.now());
        }
        
        movieRepository.saveAll(upcomingMovies);
        movieRepository.saveAll(playingMovies);
    }
    
    // 장르별 영화 목록 조회
    public List<MovieResponse> getMoviesByGenre(String genre) {
        List<Movie> movies = movieRepository.findByGenreContainingAndStatus(
                genre, MovieStatus.NOW_SHOWING);
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 감독별 영화 목록 조회
    public List<MovieResponse> getMoviesByDirector(String director) {
        List<Movie> movies = movieRepository.findByDirectorContaining(director);
        
        return movies.stream()
                .map(MovieResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
