// src/store/slices/userSlice.jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../../services/userService';

// 사용자 프로필 정보 가져오기
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserProfile();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '프로필 정보를 불러오는데 실패했습니다.');
    }
  }
);

// 최근 예매 내역 가져오기
export const fetchRecentReservations = createAsyncThunk(
  'user/fetchRecentReservations',
  async ({ limit = 3 }, { rejectWithValue }) => {
    try {
      const response = await userService.getRecentReservations(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '최근 예매 내역을 불러오는데 실패했습니다.');
    }
  }
);

// 사용자 쿠폰 목록 가져오기
export const fetchUserCoupons = createAsyncThunk(
  'user/fetchUserCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserCoupons();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '쿠폰 정보를 불러오는데 실패했습니다.');
    }
  }
);

// 찜한 영화 목록 가져오기
export const fetchFavoriteMovies = createAsyncThunk(
  'user/fetchFavoriteMovies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getFavoriteMovies();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '찜한 영화 목록을 불러오는데 실패했습니다.');
    }
  }
);

// 영화 찜하기/취소하기
export const toggleFavoriteMovie = createAsyncThunk(
  'user/toggleFavoriteMovie',
  async ({ movieId, isFavorite }, { rejectWithValue }) => {
    try {
      const response = await userService.toggleFavoriteMovie(movieId, isFavorite);
      return { movieId, isFavorite: response.data.isFavorite };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '영화 찜하기/취소에 실패했습니다.');
    }
  }
);

// 사용자 포인트 내역 가져오기
export const fetchUserPoints = createAsyncThunk(
  'user/fetchUserPoints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserPoints();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || '포인트 내역을 불러오는데 실패했습니다.');
    }
  }
);

export const fetchWatchedMovies = createAsyncThunk(
  'user/fetchWatchedMovies',
  async ({ page = 0, size = 12, sort = 'watchedDate' }, { rejectWithValue }) => {
    try {
      // API 호출 (실제 구현 시 axios 등으로 대체)
      const response = await fetch(`/api/user/watched-movies?page=${page}&size=${size}&sort=${sort}`);

      if (!response.ok) {
        throw new Error('관람 내역을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePaymentMethod = createAsyncThunk(
  'user/deletePaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      // API 호출 (실제 구현 시 axios 등으로 대체)
      const response = await fetch(`/api/user/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('결제 수단 삭제에 실패했습니다.');
      }

      return paymentMethodId; // 성공 시 삭제된 ID 반환
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'user/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      // API 호출 (실제 구현 시 axios 등으로 대체)
      const response = await fetch('/api/user/payment-methods');

      if (!response.ok) {
        throw new Error('결제 수단 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'user/setDefaultPaymentMethod',
  async (paymentMethodId, { rejectWithValue }) => {
    try {
      // API 호출 (실제 구현 시 axios 등으로 대체)
      const response = await fetch(`/api/user/payment-methods/${paymentMethodId}/default`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('기본 결제 수단 설정에 실패했습니다.');
      }

      return paymentMethodId; // 성공 시 설정된 ID 반환
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 초기 상태
const initialState = {
  user: null,
  recentReservations: [],
  coupons: [],
  favoriteMovies: [],
  pointHistory: [],
  loading: false,
  error: null,
  watchedMovies: { content: [], totalPages: 0 },
};

// userSlice 생성
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      return initialState;
    },
    updateUserPoints: (state, action) => {
      if (state.user) {
        state.user.points = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // 사용자 프로필 정보 가져오기
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 최근 예매 내역 가져오기
      .addCase(fetchRecentReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentReservations.fulfilled, (state, action) => {
        state.recentReservations = action.payload;
        state.loading = false;
      })
      .addCase(fetchRecentReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 사용자 쿠폰 목록 가져오기
      .addCase(fetchUserCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 찜한 영화 목록 가져오기
      .addCase(fetchFavoriteMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavoriteMovies.fulfilled, (state, action) => {
        state.favoriteMovies = action.payload;
        state.loading = false;
      })
      .addCase(fetchFavoriteMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 영화 찜하기/취소하기
      .addCase(toggleFavoriteMovie.fulfilled, (state, action) => {
        const { movieId, isFavorite } = action.payload;

        if (isFavorite) {
          // 찜한 영화에 추가
          if (!state.favoriteMovies.some(movie => movie.id === movieId)) {
            // 찜한 영화 목록이 아직 로드되지 않았거나, 새로운 영화를 찜한 경우
            // 실제 구현에서는 영화 상세 정보를 추가해야 함
          }
        } else {
          // 찜한 영화에서 제거
          state.favoriteMovies = state.favoriteMovies.filter(movie => movie.id !== movieId);
        }
      })

      // 사용자 포인트 내역 가져오기
      .addCase(fetchUserPoints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPoints.fulfilled, (state, action) => {
        state.pointHistory = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPoints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchWatchedMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWatchedMovies.fulfilled, (state, action) => {
        state.watchedMovies = action.payload;
        state.loading = false;
      })
      .addCase(fetchWatchedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        // 삭제된 결제 수단 ID로 필터링하여 제거
        state.paymentMethods = state.paymentMethods.filter(
          method => method.id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
        state.loading = false;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        // 모든 결제 수단의 isDefault를 false로 설정하고
        // 선택된 결제 수단만 isDefault를 true로 설정
        state.paymentMethods = state.paymentMethods.map(method => ({
          ...method,
          isDefault: method.id === action.payload
        }));
        state.loading = false;
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// 액션 생성자 내보내기
export const { clearUserData, updateUserPoints } = userSlice.actions;

// 리듀서 내보내기
export default userSlice.reducer;