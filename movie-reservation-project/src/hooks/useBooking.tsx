// ==========================================================
// Booking 상태 정의

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Seat } from "../types/booking.types";
import type { Movie } from "../types/movie.types";
import type { Screening, Theater } from "../types/theater.types";

// ==========================================================
export interface BookingState {
  selectedMovie: Movie | null;
  selectedTheater: Theater | null;
  selectedDate: string | null;
  selectedScreening: Screening | null;
  selectedSeats: Seat[];
  ticketTypes: {
    adult: number;
    teen: number;
    child: number;
  };
  totalPrice: number;
  currentStep: number;
}

// ==========================================================
// Booking 액션 정의
// ==========================================================
export interface BookingActions {
  selectMovie: (movie: Movie) => void;
  selectTheater: (theater: Theater) => void;
  selectDate: (date: string) => void;
  selectScreening: (screening: Screening) => void;
  selectSeat: (seat: Seat) => void;
  unselectSeat: (seat: Seat) => void;
  setTicketType: (type: keyof BookingState['ticketTypes'], count: number) => void;
  calculatePrice: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
}

// ==========================================================
// useBooking 훅 로직
// ==========================================================
export const useBookingLogic = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [ticketTypes, setTicketTypes] = useState<BookingState['ticketTypes']>({
    adult: 0,
    teen: 0,
    child: 0,
  });
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState(0); // 0: Movie, 1: Theater, 2: DateTime, 3: Seat, 4: Payment

  // 영화 선택
  const selectMovie = useCallback((movie: Movie | null) => {
    setSelectedMovie(movie);
    // 영화를 다시 선택하면 다른 모든 선택 초기화
    setSelectedTheater(null);
    setSelectedDate(null);
    setSelectedScreening(null);
    setSelectedSeats([]);
    setTicketTypes({ adult: 0, teen: 0, child: 0 });
    setTotalPrice(0);
    setCurrentStep(0); // 다시 첫 단계로
  }, []);

  // 극장 선택
  const selectTheater = useCallback((theater: Theater | null) => {
    setSelectedTheater(theater);
    setSelectedDate(null);
    setSelectedScreening(null);
    setSelectedSeats([]);
    setTicketTypes({ adult: 0, teen: 0, child: 0 });
    setTotalPrice(0);
  }, []);
  
  // 날짜 선택
  const selectDate = useCallback((date: string | null) => {
    setSelectedDate(date);
    setSelectedScreening(null); // 날짜 변경 시 상영 정보 초기화
    setSelectedSeats([]);
    setTicketTypes({ adult: 0, teen: 0, child: 0 });
    setTotalPrice(0);
  }, []);

  // 상영 정보 선택
  const selectScreening = useCallback((screening: Screening | null) => {
    setSelectedScreening(screening);
    // 상영 정보 변경 시 좌석 및 티켓 초기화
    setSelectedSeats([]);
    setTicketTypes({ adult: 0, teen: 0, child: 0 });
    setTotalPrice(0);
  }, []);

  // 좌석 선택
  const selectSeat = useCallback((seat: Seat) => {
    setSelectedSeats((prevSeats) => [...prevSeats, seat]);
  }, []);

  // 좌석 선택 해제
  const unselectSeat = useCallback((seat: Seat) => {
    setSelectedSeats((prevSeats) => prevSeats.filter((s) => s.id !== seat.id));
  }, []);

  // 티켓 종류별 수량 설정
  const setTicketType = useCallback((type: keyof BookingState['ticketTypes'], count: number) => {
    setTicketTypes((prev) => ({
      ...prev,
      [type]: count,
    }));
  }, []);

  // 가격 계산 로직 (selectedScreening, ticketTypes, selectedSeats 변경 시 재계산)
  const calculatePrice = useCallback(() => {
    if (!selectedScreening) {
      setTotalPrice(0);
      return;
    }

    let currentCalculatedPrice = 0;
    const basePrice = selectedScreening.price; // 예: 14000원

    // 각 티켓 종류별 가격 계산 (여기서는 예시로 성인 가격만 사용)
    currentCalculatedPrice += ticketTypes.adult * basePrice;
    currentCalculatedPrice += ticketTypes.teen * (basePrice - 2000); // 청소년 할인 예시
    currentCalculatedPrice += ticketTypes.child * (basePrice - 6000); // 어린이 할인 예시

    setTotalPrice(currentCalculatedPrice);
  }, [selectedScreening, ticketTypes]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]); // calculatePrice가 변경될 때만 실행

  // 다음 단계로 이동
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  // 이전 단계로 이동
  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // 예매 초기화
  const resetBooking = useCallback(() => {
    setSelectedMovie(null);
    setSelectedTheater(null);
    setSelectedDate(null);
    setSelectedScreening(null);
    setSelectedSeats([]);
    setTicketTypes({ adult: 0, teen: 0, child: 0 });
    setTotalPrice(0);
    setCurrentStep(0);
  }, []);

  // useMemo를 사용하여 상태와 액션을 한 번만 생성하고, 의존성이 변경될 때만 다시 생성
  const state = useMemo(() => ({
    selectedMovie,
    selectedTheater,
    selectedDate,
    selectedScreening,
    selectedSeats,
    ticketTypes,
    totalPrice,
    currentStep,
  }), [selectedMovie, selectedTheater, selectedDate, selectedScreening, selectedSeats, ticketTypes, totalPrice, currentStep]);

  const actions = useMemo(() => ({
    selectMovie,
    selectTheater,
    selectDate,
    selectScreening,
    selectSeat,
    unselectSeat,
    setTicketType,
    calculatePrice,
    nextStep,
    prevStep,
    resetBooking,
  }), [selectMovie, selectTheater, selectDate, selectScreening, selectSeat, unselectSeat, setTicketType, calculatePrice, nextStep, prevStep, resetBooking]);

  return { state, ...actions }; // 상태와 액션을 한 객체로 반환
};