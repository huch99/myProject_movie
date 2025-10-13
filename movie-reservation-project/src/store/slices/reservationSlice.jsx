// 예매 관련 슬라이스
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reservationService from '../../services/reservationService';
import storageUtils from '../../utils/storageUtils';
import { SEAT_SELECTION_TIMEOUT } from '../../styles/variables';


// 초기 상태 정의
const initialState = {
    currentReservation: null,
    selectedSeats: [],
    selectedScreening: null,
    selectedDate: null,
    audienceCount: {
        adult: 0,
        teen: 0,
        child: 0,
        senior: 0,
    },
    priceDetails: {
        adultPrice: 0,
        teenPrice: 0,
        childPrice: 0,
        seniorPrice: 0,
        totalPrice: 0,
    },
    availableSeats: [],
    reservationHistory: [],
    loading: false,
    error: null,
    timeRemaining: SEAT_SELECTION_TIMEOUT * 60, // 초 단위로 저장 (기본 10분)
    timerActive: false,
    paymentInfo: null,
    appliedCoupon: null,
    step: 'screening', // 'screening', 'seats', 'payment', 'complete'
    reservation: null,
    availableDates: [],
    paymentResult: null,
    reservations: { content: [], totalPages: 0 },
};

// 좌석 가용성 확인
export const checkSeatAvailability = createAsyncThunk(
    'reservations/checkSeatAvailability',
    async (screeningId, { rejectWithValue }) => {
        try {
            const response = await reservationService.checkSeatAvailability(screeningId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '좌석 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 예매 생성
export const createReservation = createAsyncThunk(
    'reservations/createReservation',
    async (reservationData, { rejectWithValue }) => {
        try {
            const response = await reservationService.createReservation(reservationData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '예매에 실패했습니다.');
        }
    }
);

// 예매 정보 조회
export const getReservation = createAsyncThunk(
    'reservations/getReservation',
    async (reservationId, { rejectWithValue }) => {
        try {
            const response = await reservationService.getReservation(reservationId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '예매 정보를 불러오는데 실패했습니다.');
        }
    }
);

// 예매 취소
export const cancelReservation = createAsyncThunk(
    'reservations/cancelReservation',
    async (reservationId, { rejectWithValue }) => {
        try {
            const response = await reservationService.cancelReservation(reservationId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '예매 취소에 실패했습니다.');
        }
    }
);

// 예매 내역 조회
export const getUserReservations = createAsyncThunk(
    'reservations/getUserReservations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await reservationService.getUserReservations();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || '예매 내역을 불러오는데 실패했습니다.');
        }
    }
);

export const fetchAvailableDates = createAsyncThunk(
    'reservation/fetchAvailableDates',
    async (movieId, { rejectWithValue }) => {
        try {
            // API 호출로 실제 구현 (임시 구현)
            const response = await fetch(`/api/movies/${movieId}/available-dates`);

            if (!response.ok) {
                throw new Error('상영 가능 날짜를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchReservationDetails = createAsyncThunk(
    'reservation/fetchReservationDetails',
    async (reservationId, { rejectWithValue }) => {
        try {
            // API 호출 (실제 구현 시 axios 등으로 대체)
            const response = await fetch(`/api/reservations/${reservationId}`);

            if (!response.ok) {
                throw new Error('예매 정보를 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const processPayment = createAsyncThunk(
    'reservation/processPayment',
    async (paymentRequest, { rejectWithValue }) => {
        try {
            // API 호출 (실제 구현 시 axios 등으로 대체)
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentRequest),
            });

            if (!response.ok) {
                throw new Error('결제 처리 중 오류가 발생했습니다.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchReservations = createAsyncThunk(
    'reservation/fetchReservations',
    async ({ page = 0, size = 5 }, { rejectWithValue }) => {
        try {
            // API 호출 (실제 구현 시 axios 등으로 대체)
            const response = await fetch(`/api/reservations?page=${page}&size=${size}`);

            if (!response.ok) {
                throw new Error('예매 내역을 불러오는데 실패했습니다.');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// 예매 슬라이스 생성
const reservationSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {
        // 상영 정보 선택
        selectScreening: (state, action) => {
            state.selectedScreening = action.payload;
            state.step = 'seats';
            state.selectedSeats = [];
            state.timerActive = true;
            state.timeRemaining = SEAT_SELECTION_TIMEOUT * 60;
        },

        // 날짜 선택
        selectDate: (state, action) => {
            state.selectedDate = action.payload;
        },

        // 좌석 선택
        selectSeat: (state, action) => {
            const seat = action.payload;
            const totalSelectedCount = Object.values(state.audienceCount).reduce((sum, count) => sum + count, 0);

            // 이미 선택된 좌석인지 확인
            const existingIndex = state.selectedSeats.findIndex(s => s.id === seat.id);

            if (existingIndex !== -1) {
                // 이미 선택된 좌석이면 제거
                state.selectedSeats = state.selectedSeats.filter(s => s.id !== seat.id);
            } else {
                // 선택된 인원수보다 좌석을 더 선택할 수 없음
                if (state.selectedSeats.length >= totalSelectedCount) {
                    return;
                }
                // 새 좌석 추가
                state.selectedSeats.push(seat);
            }

            // 로컬 스토리지에 선택한 좌석 저장
            storageUtils.cart.setSelectedSeats(state.selectedSeats);
        },

        // 인원 수 업데이트
        updateAudienceCount: (state, action) => {
            const { type, count } = action.payload;
            if (count >= 0) {
                state.audienceCount[type] = count;

                // 가격 재계산
                const priceDetails = reservationService.calculatePrice({
                    adultCount: state.audienceCount.adult,
                    childCount: state.audienceCount.child,
                    teenCount: state.audienceCount.teen,
                    seniorCount: state.audienceCount.senior,
                    seatGrade: state.selectedScreening?.screen?.seatGrade || 'normal'
                });

                state.priceDetails = priceDetails;

                // 선택된 인원수가 현재 선택된 좌석보다 적을 경우, 좌석 선택 초기화
                const totalSelectedCount = Object.values(state.audienceCount).reduce((sum, count) => sum + count, 0);
                if (totalSelectedCount < state.selectedSeats.length) {
                    state.selectedSeats = [];
                    storageUtils.cart.setSelectedSeats([]);
                }
            }
        },

        // 타이머 업데이트
        updateTimer: (state, action) => {
            if (state.timerActive) {
                state.timeRemaining = action.payload;
                if (state.timeRemaining <= 0) {
                    // 시간 초과 시 선택 초기화
                    state.timerActive = false;
                    state.selectedSeats = [];
                    storageUtils.cart.setSelectedSeats([]);
                }
            }
        },

        // 타이머 중지
        stopTimer: (state) => {
            state.timerActive = false;
        },

        // 타이머 리셋
        resetTimer: (state) => {
            state.timerActive = true;
            state.timeRemaining = SEAT_SELECTION_TIMEOUT * 60;
        },

        // 결제 정보 설정
        setPaymentInfo: (state, action) => {
            state.paymentInfo = action.payload;
            state.step = 'payment';
        },

        // 쿠폰 적용
        applyCoupon: (state, action) => {
            state.appliedCoupon = action.payload;

            // 쿠폰 할인 적용 후 가격 재계산
            if (action.payload && action.payload.discountAmount) {
                const discountAmount = action.payload.discountAmount;
                state.priceDetails.totalPrice = Math.max(0, state.priceDetails.totalPrice - discountAmount);
            }
        },

        // 쿠폰 제거
        removeCoupon: (state) => {
            // 원래 가격으로 복원
            if (state.appliedCoupon) {
                const priceDetails = reservationService.calculatePrice({
                    adultCount: state.audienceCount.adult,
                    childCount: state.audienceCount.child,
                    teenCount: state.audienceCount.teen,
                    seniorCount: state.audienceCount.senior,
                    seatGrade: state.selectedScreening?.screen?.seatGrade || 'normal'
                });

                state.priceDetails = priceDetails;
                state.appliedCoupon = null;
            }
        },

        // 예매 단계 변경
        setReservationStep: (state, action) => {
            state.step = action.payload;
        },

        // 예매 정보 초기화
        clearReservation: (state) => {
            state.currentReservation = null;
            state.selectedSeats = [];
            state.selectedScreening = null;
            state.selectedDate = null;
            state.audienceCount = {
                adult: 0,
                teen: 0,
                child: 0,
                senior: 0,
            };
            state.priceDetails = {
                adultPrice: 0,
                teenPrice: 0,
                childPrice: 0,
                seniorPrice: 0,
                totalPrice: 0,
            };
            state.appliedCoupon = null;
            state.paymentInfo = null;
            state.step = 'screening';
            state.timerActive = false;

            // 로컬 스토리지 정리
            storageUtils.cart.clearReservationData();
            storageUtils.cart.clearSelectedSeats();
        },

        // 에러 메시지 초기화
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // 좌석 가용성 확인 처리
            .addCase(checkSeatAvailability.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkSeatAvailability.fulfilled, (state, action) => {
                state.loading = false;
                state.availableSeats = action.payload;
            })
            .addCase(checkSeatAvailability.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 예매 생성 처리
            .addCase(createReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReservation = action.payload;
                state.step = 'complete';
                state.timerActive = false;

                // 로컬 스토리지 정리
                storageUtils.cart.clearReservationData();
                storageUtils.cart.clearSelectedSeats();
            })
            .addCase(createReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 예매 정보 조회 처리
            .addCase(getReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReservation.fulfilled, (state, action) => {
                state.loading = false;
                state.currentReservation = action.payload;
            })
            .addCase(getReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 예매 취소 처리
            .addCase(cancelReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(cancelReservation.fulfilled, (state, action) => {
                state.loading = false;
                // 예매 내역에서 취소된 예매 업데이트
                if (state.reservationHistory.length > 0) {
                    state.reservationHistory = state.reservationHistory.map(res =>
                        res.id === action.payload.id ? action.payload : res
                    );
                }
            })
            .addCase(cancelReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 예매 내역 조회 처리
            .addCase(getUserReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservationHistory = action.payload;
            })
            .addCase(getUserReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchAvailableDates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAvailableDates.fulfilled, (state, action) => {
                state.availableDates = action.payload;
                state.loading = false;
            })
            .addCase(fetchAvailableDates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReservationDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservationDetails.fulfilled, (state, action) => {
                state.reservation = action.payload;
                state.loading = false;
            })
            .addCase(fetchReservationDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(processPayment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(processPayment.fulfilled, (state, action) => {
                state.paymentResult = action.payload;
                state.loading = false;
            })
            .addCase(processPayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.reservations = action.payload;
                state.loading = false;
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// 액션 생성자 내보내기
export const {
    selectScreening,
    selectDate,
    selectSeat,
    updateAudienceCount,
    updateTimer,
    stopTimer,
    resetTimer,
    setPaymentInfo,
    applyCoupon,
    removeCoupon,
    setReservationStep,
    clearReservation,
    clearError
} = reservationSlice.actions;

// 리듀서 내보내기
export default reservationSlice.reducer;