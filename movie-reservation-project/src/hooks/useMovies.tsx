import { useEffect, useState } from 'react';
import type { Movie } from '../types/movie.types';
import api from '../service/api';

// useMovies 훅 로직
interface UseMoviesResult {
  movies: Movie[];
  nowPlayingMovies: Movie[];
  comingSoonMovies: Movie[];
  movieDetail: Movie | null;
  similarMovies: Movie[];
  loading: boolean;
  error: string | null;
  fetchMovies: (isShowing?: boolean) => Promise<void>;
  fetchMovieById: (id: number) => Promise<void>;
}

export const useMovies = (): UseMoviesResult => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([]);
  const [movieDetail, setMovieDetail] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 모든 영화 또는 상영 여부에 따른 영화 목록 가져오기
  const fetchMovies = async (isShowing?: boolean): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // isShowing 파라미터가 있으면 쿼리 파라미터로 추가
      const url = isShowing !== undefined ? `/movies?isShowing=${isShowing}` : '/movies';
      const response = await api.get<Movie[]>(url);
      
      setMovies(response.data);
      
      // 현재 상영작과 상영 예정작 분류
      if (isShowing === undefined) {
        const nowPlaying = response.data.filter(movie => movie.isShowing);
        const comingSoon = response.data.filter(movie => !movie.isShowing);
        
        setNowPlayingMovies(nowPlaying);
        setComingSoonMovies(comingSoon);
      }
    } catch (err: any) {
      setError(err.message || '영화 목록을 불러오는 중 오류가 발생했습니다.');
      console.error('영화 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 특정 영화 상세 정보 가져오기
  const fetchMovieById = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // 영화 상세 정보 가져오기
      const response = await api.get<Movie>(`/movies/${id}`);
      setMovieDetail(response.data);
      
      // 유사한 영화 목록 가져오기 (같은 장르의 다른 영화들)
      const similarResponse = await api.get<Movie[]>(`/movies/${id}/similar`);
      setSimilarMovies(similarResponse.data);
    } catch (err: any) {
      setError(err.message || '영화 상세 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('영화 상세 정보 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 모든 영화 데이터 로드
  useEffect(() => {
    fetchMovies();
  }, []);
  
  return {
    movies,
    nowPlayingMovies,
    comingSoonMovies,
    movieDetail,
    similarMovies,
    loading,
    error,
    fetchMovies,
    fetchMovieById
  };
};