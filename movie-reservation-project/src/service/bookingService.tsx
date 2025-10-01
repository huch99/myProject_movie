import type { Seat, Ticket } from "../types/booking.types";
import type { Screening } from "../types/theater.types";
import api from "./api";

// 상영 정보 검색 매개변수 타입
interface ScreeningSearchParams {
  movieId?: number;
  theaterId?: number;
  date?: string;
  page?: number;
  limit?: number;
}

// 예매 생성 요청 타입
interface BookingRequest {
  screeningId: number;
  seats: string[];
  ticketTypes: {
    adult: number;
    teen: number;
    child: number;
  };
  totalPrice: number;
}

// 예매 서비스 클래스
class BookingService {
  // 상영 정보 목록 가져오기
  async getScreenings(params: ScreeningSearchParams = {}): Promise<Screening[]> {
    try {
      const response = await api.get<Screening[]>('/screenings', { params });
      return response.data;
    } catch (error) {
      console.error('상영 정보 목록 조회 실패:', error);
      throw new Error('상영 정보를 불러오는데 실패했습니다.');
    }
  }

  // 특정 상영 정보 가져오기
  async getScreeningById(screeningId: number): Promise<Screening> {
    try {
      const response = await api.get<Screening>(`/screenings/${screeningId}`);
      return response.data;
    } catch (error) {
      console.error('상영 정보 조회 실패:', error);
      throw new Error('상영 정보를 불러오는데 실패했습니다.');
    }
  }

  // 특정 영화의 상영 정보 가져오기
  async getScreeningsByMovie(movieId: number, date?: string, theaterId?: number): Promise<Screening[]> {
    try {
      const params: ScreeningSearchParams = { movieId };

      if (date) params.date = date;
      if (theaterId) params.theaterId = theaterId;

      const response = await api.get<Screening[]>('/screenings', { params });
      return response.data;
    } catch (error) {
      console.error('영화 상영 정보 조회 실패:', error);
      throw new Error('영화 상영 정보를 불러오는데 실패했습니다.');
    }
  }

  // 특정 극장의 상영 정보 가져오기
  async getScreeningsByTheater(theaterId: number, date?: string, movieId?: number): Promise<Screening[]> {
    try {
      const params: ScreeningSearchParams = { theaterId };

      if (date) params.date = date;
      if (movieId) params.movieId = movieId;

      const response = await api.get<Screening[]>('/screenings', { params });
      return response.data;
    } catch (error) {
      console.error('극장 상영 정보 조회 실패:', error);
      throw new Error('극장 상영 정보를 불러오는데 실패했습니다.');
    }
  }

  // 좌석 정보 가져오기
  async getSeats(screeningId: number): Promise<Seat[]> {
    try {
      const response = await api.get<Seat[]>(`/screenings/${screeningId}/seats`);
      return response.data;
    } catch (error) {
      console.error('좌석 정보 조회 실패:', error);
      throw new Error('좌석 정보를 불러오는데 실패했습니다.');
    }
  }

  // 예매하기
  async createBooking(bookingData: BookingRequest): Promise<Ticket> {
    try {
      const response = await api.post<Ticket>('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('예매 생성 실패:', error);
      throw new Error('예매에 실패했습니다. 다시 시도해 주세요.');
    }
  }

  // 예매 정보 가져오기
  async getBooking(bookingId: number): Promise<Ticket> {
    try {
      const response = await api.get<Ticket>(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('예매 정보 조회 실패:', error);
      throw new Error('예매 정보를 불러오는데 실패했습니다.');
    }
  }

  // 사용자의 예매 내역 가져오기
  async getUserBookings(): Promise<Ticket[]> {
    try {
      const response = await api.get<Ticket[]>('/bookings/my');
      return response.data;
    } catch (error) {
      console.error('예매 내역 조회 실패:', error);
      throw new Error('예매 내역을 불러오는데 실패했습니다.');
    }
  }

  // 예매 취소하기
  async cancelBooking(bookingId: number): Promise<void> {
    try {
      await api.delete(`/bookings/${bookingId}`);
    } catch (error) {
      console.error('예매 취소 실패:', error);
      throw new Error('예매 취소에 실패했습니다. 다시 시도해 주세요.');
    }
  }

  // 티켓 가격 계산하기
  calculateTicketPrice(screening: Screening, ticketTypes: { adult: number; teen: number; child: number }): number {
    const basePrice = screening.price || 14000; // 기본 가격이 없을 경우 14,000원으로 설정

    const adultPrice = basePrice;
    const teenPrice = basePrice - 2000; // 청소년 할인 (2,000원)
    const childPrice = basePrice - 6000; // 어린이 할인 (6,000원)

    const totalPrice =
      (ticketTypes.adult * adultPrice) +
      (ticketTypes.teen * teenPrice) +
      (ticketTypes.child * childPrice);

    return totalPrice;
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
const bookingService = new BookingService();
export default bookingService;