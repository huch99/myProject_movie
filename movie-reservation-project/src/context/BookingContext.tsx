import React, { createContext, useContext } from "react";
import { useBookingLogic, type BookingState } from "../hooks/useBooking";

// Context에 저장될 값의 타입 정의
interface BookingContextType {
  state: BookingState;
  selectMovie: (movie: BookingState['selectedMovie']) => void;
  selectTheater: (theater: BookingState['selectedTheater']) => void;
  selectDate: (date: BookingState['selectedDate']) => void;
  selectScreening: (screening: BookingState['selectedScreening']) => void;
  selectSeat: (seat: BookingState['selectedSeats'][number]) => void;
  unselectSeat: (seat: BookingState['selectedSeats'][number]) => void;
  setTicketType: (type: keyof BookingState['ticketTypes'], count: number) => void;
  calculatePrice: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
}

// 초기값 (Context 사용 전에는 이 값이 사용됨)
const initialContext: BookingContextType = {
  state: {
    selectedMovie: null,
    selectedTheater: null,
    selectedDate: null,
    selectedScreening: null,
    selectedSeats: [],
    ticketTypes: { adult: 0, teen: 0, child: 0 },
    totalPrice: 0,
    currentStep: 0,
  },
  selectMovie: () => {},
  selectTheater: () => {},
  selectDate: () => {},
  selectScreening: () => {},
  selectSeat: () => {},
  unselectSeat: () => {},
  setTicketType: () => {},
  calculatePrice: () => {},
  nextStep: () => {},
  prevStep: () => {},
  resetBooking: () => {},
};

// Context 생성
const BookingContext = createContext<BookingContextType>(initialContext);

// Context Provider 컴포넌트
interface BookingProviderProps {
  children: React.ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const booking = useBookingLogic(); // useBookingLogic 훅 호출
  
  // useMemo로 booking 객체가 불필요하게 다시 생성되지 않도록 함
  const contextValue = React.useMemo(() => ({
    state: booking.state,
    selectMovie: booking.selectMovie,
    selectTheater: booking.selectTheater,
    selectDate: booking.selectDate,
    selectScreening: booking.selectScreening,
    selectSeat: booking.selectSeat,
    unselectSeat: booking.unselectSeat,
    setTicketType: booking.setTicketType,
    calculatePrice: booking.calculatePrice,
    nextStep: booking.nextStep,
    prevStep: booking.prevStep,
    resetBooking: booking.resetBooking,
  }), [booking]);


  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

// 커스텀 훅: BookingContext를 사용하기 위한 훅
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};