// 극장 관련 슬라이스
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import theaterService from '../../services/theaterService';
import apiService, { api } from '../../services/api';

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
    location: [],
    selectedRegion: null,
};

// 모든 극장 목록 가져오기
export const fetchTheaters = createAsyncThunk(
    'theaters/fetchTheaters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/theaters');
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
            console.log(error.message);
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
            console.log(error.message);
            return rejectWithValue(error.response?.data?.message || '상영관 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 극장 상영 일정 가져오기
// export const fetchTheaterSchedules = createAsyncThunk(
//     'theaters/fetchTheaterSchedules',
//     async ({ theaterId, date }, { rejectWithValue }) => {
//         try {
//             const response = await theaterService.getTheaterSchedules(theaterId, date);
//             console.log(response.data);
//             return response.data;
//         } catch (error) {
//             console.log(error.message);
//             return rejectWithValue(error.response?.data?.message || '상영 일정을 불러오는데 실패했습니다.');
//         }
//     }
// );

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

                const incomingTheaters = action.payload?.data?.content || [];

                if (Array.isArray(incomingTheaters) && JSON.stringify(state.theaters) !== JSON.stringify(incomingTheaters)) {
                    state.theaters = incomingTheaters;
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
            // .addCase(fetchTheaterSchedules.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(fetchTheaterSchedules.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.schedules = action.payload;
            // })
            // .addCase(fetchTheaterSchedules.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload;
            // })

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