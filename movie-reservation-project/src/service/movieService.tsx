import type { Movie } from "../types/movie.types";
import api from "./api";

// 영화 검색 매개변수 타입
interface MovieSearchParams {
    query?: string;
    genre?: string;
    isShowing?: boolean;
    page?: number;
    limit?: number;
}

// 영화 검색 응답 타입
interface MovieSearchResponse {
    movies: Movie[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// 영화 서비스 클래스
class MovieService {
    // 영화 목록 가져오기 (검색 조건 포함)
    async getMovies(params: MovieSearchParams = {}): Promise<MovieSearchResponse> {
        try {
            const response = await api.get<MovieSearchResponse>('/movies', { params });
            return response.data;
        } catch (error) {
            console.error('영화 목록 조회 실패:', error);
            throw new Error('영화 목록을 불러오는데 실패했습니다.');
        }
    }

    // 현재 상영작 가져오기
    async getNowPlayingMovies(page: number = 1, limit: number = 10): Promise<MovieSearchResponse> {
        return this.getMovies({ isShowing: true, page, limit });
    }

    // 상영 예정작 가져오기
    async getComingSoonMovies(page: number = 1, limit: number = 10): Promise<MovieSearchResponse> {
        return this.getMovies({ isShowing: false, page, limit });
    }

    // 영화 상세 정보 가져오기
    async getMovieById(id: number): Promise<Movie> {
        try {
            const response = await api.get<Movie>(`/movies/${id}`);
            return response.data;
        } catch (error) {
            console.error('영화 상세 정보 조회 실패:', error);
            throw new Error('영화 정보를 불러오는데 실패했습니다.');
        }
    }

    // 비슷한 영화 가져오기
    async getSimilarMovies(id: number, limit: number = 4): Promise<Movie[]> {
        try {
            const response = await api.get<Movie[]>(`/movies/${id}/similar`, { params: { limit } });
            return response.data;
        } catch (error) {
            console.error('비슷한 영화 조회 실패:', error);
            throw new Error('비슷한 영화를 불러오는데 실패했습니다.');
        }
    }

    // 영화 검색하기
    async searchMovies(query: string, page: number = 1, limit: number = 10): Promise<MovieSearchResponse> {
        return this.getMovies({ query, page, limit });
    }

    // 장르별 영화 가져오기
    async getMoviesByGenre(genre: string, page: number = 1, limit: number = 10): Promise<MovieSearchResponse> {
        return this.getMovies({ genre, page, limit });
    }

    // 영화 평점 등록
    async rateMovie(movieId: number, rating: number, comment?: string): Promise<void> {
        try {
            await api.post(`/movies/${movieId}/ratings`, { rating, comment });
        } catch (error) {
            console.error('영화 평점 등록 실패:', error);
            throw new Error('영화 평점을 등록하는데 실패했습니다.');
        }
    }

    // 영화 평점 목록 가져오기
    async getMovieRatings(movieId: number, page: number = 1, limit: number = 10): Promise<any> {
        try {
            const response = await api.get(`/movies/${movieId}/ratings`, {
                params: { page, limit }
            });
            return response.data;
        } catch (error) {
            console.error('영화 평점 목록 조회 실패:', error);
            throw new Error('영화 평점을 불러오는데 실패했습니다.');
        }
    }

    // 인기 영화 가져오기
    async getPopularMovies(limit: number = 5): Promise<Movie[]> {
        try {
            const response = await api.get<Movie[]>('/movies/popular', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            console.error('인기 영화 조회 실패:', error);
            throw new Error('인기 영화를 불러오는데 실패했습니다.');
        }
    }

    // 장르 목록 가져오기
    async getGenres(): Promise<string[]> {
        try {
            const response = await api.get<string[]>('/movies/genres');
            return response.data;
        } catch (error) {
            console.error('장르 목록 조회 실패:', error);
            throw new Error('영화 장르 목록을 불러오는데 실패했습니다.');
        }
    }
}

// 싱글톤 인스턴스 생성 및 내보내기
const movieService = new MovieService();
export default movieService;