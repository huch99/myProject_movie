// 극장 관련 슬라이스
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import theaterService from '../../services/theaterService';

// 초기 상태 정의
const initialState = {
    theaters: [],
    currentTheater: null,
    screens: [],
    schedules: [],
    recentTheaters: [],
    favoriteTheaters: [],
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
    searchError: null,
    regions: [],
    selectedRegion: null,
};

// 모든 극장 목록 가져오기
export const fetchTheaters = createAsyncThunk(
    'theaters/fetchTheaters',
     async (_, { getState, rejectWithValue }) => {
    // Redux 스토어에서 현재 theaters 상태를 가져옴
    const { theaters } = getState().theaters; 
    
    // 이미 데이터가 존재하고 비어있지 않다면, 새로운 요청을 보내지 않음
    if (theaters && theaters.length > 0) {
      console.log('fetchTheaters: 이미 데이터 존재, 요청 생략');
      return { content: theaters }; // 기존 데이터를 그대로 반환
    }
    
    try {
      const response = await api.get('/theaters'); // api는 이전에 Huch님이 정의하신 객체
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 지역별 극장 목록 가져오기
export const fetchTheatersByRegion = createAsyncThunk(
    'theaters/fetchTheatersByRegion',
    async (location, { rejectWithValue }) => {
        try {
            const response = await theaterService.getTheatersByRegion(location);
            return { location, theaters: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '지역별 극장 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 극장 상세 정보 가져오기
export const fetchTheaterDetails = createAsyncThunk(
    'theaters/fetchTheaterDetails',
    async (theaterId, { rejectWithValue }) => {
        try {
            const response = await theaterService.getTheaterById(theaterId);

            // 최근 방문 극장에 추가
            theaterService.addRecentTheater(response.data);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '극장 상세 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 극장 상영관 목록 가져오기
export const fetchTheaterScreens = createAsyncThunk(
    'theaters/fetchTheaterScreens',
    async (theaterId, { rejectWithValue }) => {
        try {
            const response = await theaterService.getTheaterScreens(theaterId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '상영관 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 극장 상영 일정 가져오기
export const fetchTheaterSchedules = createAsyncThunk(
    'theaters/fetchTheaterSchedules',
    async ({ theaterId, date }, { rejectWithValue }) => {
        try {
            const response = await theaterService.getTheaterSchedules(theaterId, date);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '상영 일정을 불러오는데 실패했습니다.');
        }
    }
);

// 극장 검색하기
export const searchTheaters = createAsyncThunk(
    'theaters/searchTheaters',
    async (query, { rejectWithValue }) => {
        try {
            const response = await theaterService.searchTheaters(query);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '극장 검색에 실패했습니다.');
        }
    }
);

// 극장 슬라이스 생성
const theaterSlice = createSlice({
    name: 'theaters',
    initialState,
    reducers: {
        // 현재 선택된 극장 초기화
        clearCurrentTheater: (state) => {
            state.currentTheater = null;
        },

        // 검색 결과 초기화
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchLoading = false;
            state.searchError = null;
        },

        // 최근 방문 극장 목록 불러오기
        loadRecentTheaters: (state) => {
            state.recentTheaters = theaterService.getRecentTheaters();
        },

        // 즐겨찾기 극장 목록 불러오기
        loadFavoriteTheaters: (state) => {
            state.favoriteTheaters = theaterService.getFavoriteTheaters();
        },

        // 즐겨찾기 극장 추가하기
        addFavoriteTheater: (state, action) => {
            const theater = action.payload;
            const isAdded = theaterService.addFavoriteTheater(theater);

            if (isAdded) {
                state.favoriteTheaters = theaterService.getFavoriteTheaters();
            }
        },

        // 즐겨찾기 극장 제거하기
        removeFavoriteTheater: (state, action) => {
            const theaterId = action.payload;
            const isRemoved = theaterService.removeFavoriteTheater(theaterId);

            if (isRemoved) {
                state.favoriteTheaters = theaterService.getFavoriteTheaters();
            }
        },

        // 지역 선택하기
        selectRegion: (state, action) => {
            state.selectedRegion = action.payload;
        },

        // 에러 메시지 초기화
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // 모든 극장 목록 처리
            .addCase(fetchTheaters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTheaters.fulfilled, (state, action) => {
                state.loading = false;
                const incomingTheaters = action.payload.content || [];

                // ⭐ 내용이 실제로 달라졌을 때만 상태 업데이트 ⭐
                // 배열의 내용이 동일한지 비교하는 좀 더 견고한 로직 필요 (예: 각 요소의 ID 비교)
                // 간단한 배열 비교를 위해 일단 JSON.stringify를 사용하지만, 성능 저하 가능성 있음
                // 실제 운영 환경에서는 더 효율적인 딥 비교 유틸리티 함수를 사용하는 것을 권장합니다.
                if (JSON.stringify(state.theaters) !== JSON.stringify(incomingTheaters)) {
                    state.theaters = incomingTheaters;
                    // locations도 theaters에 의존하므로, theaters가 변경될 때만 업데이트
                    state.locations = [...new Set(incomingTheaters.map(theater => theater.location))];
                }
            })
            .addCase(fetchTheaters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 지역별 극장 목록 처리
            .addCase(fetchTheatersByRegion.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTheatersByRegion.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedRegion = action.payload.location;
                state.theaters = action.payload.theaters;
            })
            .addCase(fetchTheatersByRegion.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 극장 상세 정보 처리
            .addCase(fetchTheaterDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTheaterDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTheater = action.payload;
            })
            .addCase(fetchTheaterDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 극장 상영관 목록 처리
            .addCase(fetchTheaterScreens.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTheaterScreens.fulfilled, (state, action) => {
                state.loading = false;
                state.screens = action.payload;
            })
            .addCase(fetchTheaterScreens.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 극장 상영 일정 처리
            .addCase(fetchTheaterSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTheaterSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules = action.payload;
            })
            .addCase(fetchTheaterSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 극장 검색 처리
            .addCase(searchTheaters.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchTheaters.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchTheaters.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload;
            });
    },
});

// 액션 생성자 내보내기
export const {
    clearCurrentTheater,
    clearSearchResults,
    loadRecentTheaters,
    loadFavoriteTheaters,
    addFavoriteTheater,
    removeFavoriteTheater,
    selectRegion,
    clearError
} = theaterSlice.actions;

// 리듀서 내보내기
export default theaterSlice.reducer;