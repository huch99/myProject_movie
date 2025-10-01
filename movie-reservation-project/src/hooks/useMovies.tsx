// src/hooks/useMovies.ts
import { useState, useCallback, useMemo } from 'react';
import type { Movie } from '../types/movie.types';

// 영화 데이터 관련 목업 데이터 (실제로는 API 호출)
const mockMovies: Movie[] = [
  {
    id: 1,
    title: "듄: 파트 2",
    originalTitle: "Dune: Part Two",
    posterUrl: "/assets/images/posters/dune2.jpg",
    backdropUrl: "/assets/images/backdrops/dune2.jpg",
    releaseDate: "2024-02-28",
    runtime: 166,
    rating: 8.5,
    genres: ["SF", "모험", "드라마"],
    director: "드니 빌뇌브",
    actors: ["티모시 샬라메", "젠데이아", "레베카 퍼거슨"],
    synopsis: "아트레이드 가문의 후계자인 폴은 자신의 운명을 깨닫고 프레멘 전사들과 함께 하케넨 가문에 맞서 싸운다.",
    ageRating: "12",
    isShowing: true
  },
  {
    id: 2,
    title: "데드풀 & 울버린",
    originalTitle: "Deadpool & Wolverine",
    posterUrl: "/assets/images/posters/deadpool.jpg",
    backdropUrl: "/assets/images/backdrops/deadpool.jpg",
    releaseDate: "2024-07-26",
    runtime: 127,
    rating: 8.7,
    genres: ["액션", "코미디", "모험"],
    director: "숀 레비",
    actors: ["라이언 레이놀즈", "휴 잭맨", "엠마 코린"],
    synopsis: "MCU에 정식으로 합류한 데드풀과 울버린의 첫 만남을 그린 영화",
    ageRating: "18",
    isShowing: true
  },
  {
    id: 3,
    title: "원더우먼 1984",
    originalTitle: "Wonder Woman 1984",
    posterUrl: "/assets/images/posters/wonderwoman.jpg",
    backdropUrl: "/assets/images/backdrops/wonderwoman.jpg",
    releaseDate: "2024-12-25",
    runtime: 151,
    rating: 7.8,
    genres: ["액션", "모험", "판타지"],
    director: "패티 젠킨스",
    actors: ["갤 가돗", "크리스 파인", "크리스틴 위그"],
    synopsis: "1984년을 배경으로 다이애나 프린스가 소련의 음모와 맥스 로드의 위협에 맞서는 이야기",
    ageRating: "12",
    isShowing: false
  },
  {
    id: 4,
    title: "아바타: 물의 길",
    originalTitle: "Avatar: The Way of Water",
    posterUrl: "/assets/images/posters/avatar2.jpg",
    backdropUrl: "/assets/images/backdrops/avatar2.jpg",
    releaseDate: "2024-12-16",
    runtime: 192,
    rating: 8.3,
    genres: ["SF", "모험", "액션"],
    director: "제임스 카메론",
    actors: ["샘 워싱턴", "조 샐다나", "시고니 위버"],
    synopsis: "제이크 설리와 네이티리가 가족을 이루고 판도라에서 살아가던 중 맞닥뜨리는 새로운 위협",
    ageRating: "12",
    isShowing: true
  },
  {
    id: 5,
    title: "엘리멘탈",
    originalTitle: "Elemental",
    posterUrl: "/assets/images/posters/elemental.jpg",
    backdropUrl: "/assets/images/backdrops/elemental.jpg",
    releaseDate: "2024-06-14",
    runtime: 109,
    rating: 8.0,
    genres: ["애니메이션", "코미디", "로맨스"],
    director: "피터 손",
    actors: ["레아 루이스", "마모두 아티", "로나 륭"],
    synopsis: "불, 물, 공기, 흙 4원소들이 살고 있는 '엘리멘트 시티'에서 재치 있고 불처럼 뜨거운 앰버가 톡톡 튀는 물 '웨이드'를 만나면서 벌어지는 이야기",
    ageRating: "ALL",
    isShowing: true
  },
];

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
  const [movieDetail, setMovieDetail] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 영화 목록 가져오기 (필터링 옵션 포함)
  const fetchMovies = useCallback(async (isShowingFilter?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // API 호출 시뮬레이션
      let filtered = mockMovies;
      if (isShowingFilter !== undefined) {
        filtered = mockMovies.filter(movie => movie.isShowing === isShowingFilter);
      }
      setMovies(filtered);
    } catch (err: any) {
      setError('영화 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  // 특정 영화 상세 정보 가져오기
  const fetchMovieById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // API 호출 시뮬레이션
      const foundMovie = mockMovies.find(movie => movie.id === id);

      if (!foundMovie) {
        throw new Error('영화를 찾을 수 없습니다.');
      }
      setMovieDetail(foundMovie);

      // 비슷한 영화 가져오기 (같은 장르 필터링 예시)
      const similar = mockMovies
        .filter(m => m.id !== id && m.genres.some(g => foundMovie.genres.includes(g)))
        .slice(0, 4); // 최대 4개
      setSimilarMovies(similar);

    } catch (err: any) {
      setError(err.message || '영화 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  const nowPlayingMovies = useMemo(() => mockMovies.filter(movie => movie.isShowing), []);
  const comingSoonMovies = useMemo(() => mockMovies.filter(movie => !movie.isShowing), []);

  return {
    movies,
    nowPlayingMovies,
    comingSoonMovies,
    movieDetail,
    similarMovies,
    loading,
    error,
    fetchMovies,
    fetchMovieById,
  };
};