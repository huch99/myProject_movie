// 영화 관련 슬라이스
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import movieService from '../../services/movieService';

// 초기 상태 정의
const initialState = {
    movies: { content: [] },
    nowPlaying: [],
    comingSoon: [],
    popular: [],
    currentMovie: null,
    recentMovies: [],
    genres: [],
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchError: null,
};

// 현재 상영 영화 목록 가져오기
export const fetchNowPlayingMovies = createAsyncThunk(
    'movies/fetchNowPlaying',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await movieService.getNowPlaying(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '현재 상영 영화 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 개봉 예정 영화 목록 가져오기
export const fetchComingSoonMovies = createAsyncThunk(
    'movies/fetchComingSoon',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await movieService.getComingSoon(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '개봉 예정 영화 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 인기 영화 목록 가져오기
export const fetchPopularMovies = createAsyncThunk(
    'movies/fetchPopular',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await movieService.getPopular(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '인기 영화 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 영화 상세 정보 가져오기
export const fetchMovieDetails = createAsyncThunk(
    'movies/fetchMovieDetails',
    async (movieId, { rejectWithValue }) => {
        try {
            const response = await movieService.getMovieById(movieId);

            // 최근 본 영화에 추가
            movieService.addRecentViewedMovie(response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '영화 상세 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 영화 검색하기
export const searchMovies = createAsyncThunk(
    'movies/searchMovies',
    async (query, { rejectWithValue }) => {
        try {
            const response = await movieService.searchMovies(query);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '영화 검색에 실패했습니다.');
        }
    }
);

// 영화 리뷰 작성하기
export const addMovieReview = createAsyncThunk(
    'movies/addMovieReview',
    async ({ movieId, reviewData }, { rejectWithValue }) => {
        try {
            const response = await movieService.addMovieReview(movieId, reviewData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '리뷰 작성에 실패했습니다.');
        }
    }
);

export const fetchMovies = createAsyncThunk(
    'movies/fetchMovies',
    async ({ page = 0, size = 10, sort = 'releaseDate' }, { getState, rejectWithValue }) => {
        // 현재 상태 확인 (fetchMovies의 경우, 페이지 정보도 확인하는 것이 좋음)
        const { movies, currentPage, currentSize, currentSort } = getState().movies; // 현재 상태에서 필요한 값들을 가져옴

        // 현재 요청하려는 page, size, sort가 이미 불러온 데이터와 일치한다면 요청 생략
        // (정확한 비교 로직은 프로젝트 요구사항에 따라 달라질 수 있습니다)
        if (movies && movies.length > 0 && currentPage === page && currentSize === size && currentSort === sort) {
            console.log(`fetchMovies: 페이지 ${page}의 영화 데이터 존재, 요청 생략`);
            return { content: movies, page, size, sort }; // 기존 데이터를 그대로 반환
        }

        try {
            const response = await fetch(`/api/movies?page=${page}&size=${size}&sort=${sort}`);

            if (!response.ok) {
                throw new Error('영화 목록을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// 영화 슬라이스 생성
const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        // 현재 선택된 영화 초기화
        clearCurrentMovie: (state) => {
            state.currentMovie = null;
        },

        // 검색 결과 초기화
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchLoading = false;
            state.searchError = null;
        },

        // 최근 본 영화 목록 불러오기 (로컬 스토리지)
        loadRecentMovies: (state) => {
            state.recentMovies = movieService.getRecentViewedMovies();
        },

        // 에러 메시지 초기화
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // 현재 상영 영화 목록 처리
            .addCase(fetchNowPlayingMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNowPlayingMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.nowPlaying = action.payload;
            })
            .addCase(fetchNowPlayingMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 개봉 예정 영화 목록 처리
            .addCase(fetchComingSoonMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComingSoonMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.comingSoon = action.payload;
            })
            .addCase(fetchComingSoonMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 인기 영화 목록 처리
            .addCase(fetchPopularMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => {
                state.loading = false;
                state.popular = action.payload;
            })
            .addCase(fetchPopularMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 영화 상세 정보 처리
            .addCase(fetchMovieDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentMovie = action.payload;
            })
            .addCase(fetchMovieDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 영화 검색 처리
            .addCase(searchMovies.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload;
            })

            // 영화 리뷰 추가 처리
            .addCase(addMovieReview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addMovieReview.fulfilled, (state, action) => {
                state.loading = false;
                // 현재 영화가 있고, 리뷰 배열이 있다면 새 리뷰 추가
                if (state.currentMovie && state.currentMovie.reviews) {
                    state.currentMovie.reviews.unshift(action.payload);
                }
            })
            .addCase(addMovieReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMovies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.loading = false;
                const incomingMovies = action.payload.content || [];

                // 실제 데이터가 변경되었을 때만 상태 업데이트
                if (JSON.stringify(state.movies) !== JSON.stringify(incomingMovies)) {
                    state.movies = incomingMovies;
                    state.currentPage = action.payload.page || 0;
                    state.totalPages = action.payload.totalPages || 1;
                }
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// 액션 생성자 내보내기
export const {
    clearCurrentMovie,
    clearSearchResults,
    loadRecentMovies,
    clearError
} = movieSlice.actions;

// 리듀서 내보내기
export default movieSlice.reducer;