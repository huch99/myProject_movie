// 스토어 설정
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage를 사용

// 리듀서 임포트
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import theaterReducer from './slices/theaterSlice';
import reservationReducer from './slices/reservationSlice';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// 리듀서 지속성(persistence) 설정
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'accessToken', 'refreshToken', 'isAuthenticated'], // 저장할 상태 항목들
};

const moviePersistConfig = {
  key: 'movie',
  storage,
  whitelist: ['recentMovies'], // 최근 본 영화만 저장
};

const theaterPersistConfig = {
  key: 'theater',
  storage,
  whitelist: ['recentTheaters', 'favoriteTheaters'], // 최근/즐겨찾기 극장만 저장
};

const reservationPersistConfig = {
  key: 'reservation',
  storage,
  whitelist: ['selectedScreening', 'selectedDate', 'selectedSeats', 'audienceCount', 'priceDetails'], // 예매 진행 정보 저장
};

// 루트 리듀서 생성
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  movies: persistReducer(moviePersistConfig, movieReducer),
  theaters: persistReducer(theaterPersistConfig, theaterReducer),
  reservations: persistReducer(reservationPersistConfig, reservationReducer),
});

// 스토어 설정
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist 사용 시 발생하는 non-serializable value 경고 무시
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['register.timestamp'],
      },
    }), // .concat(thunk) 부분을 제거했습니다.
  devTools: process.env.NODE_ENV !== 'production',
});

// persistor 생성
export const persistor = persistStore(store);

export default { store, persistor };