// src/pages/BookingHistoryPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../components/common/Button';
import type { Ticket } from '../types/booking.types';

const Container = styled.div`
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 40px;
  font-weight: 700;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 50px;
    height: 4px;
    background-color: #e51937;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
`;

const SidebarTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 600;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarMenuItem = styled.li`
  margin-bottom: 10px;
`;

const SidebarLink = styled(Link) <{ active?: boolean }>`
  display: block;
  padding: 10px;
  color: ${props => props.active ? '#e51937' : '#333'};
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
  font-weight: ${props => props.active ? '600' : 'normal'};
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(229, 25, 55, 0.1)' : '#eee'};
  }
`;

const Content = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#e51937' : 'transparent'};
  color: ${props => props.active ? '#e51937' : '#333'};
  font-weight: ${props => props.active ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #e51937;
  }
`;

const BookingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
`;

// src/pages/BookingHistoryPage.tsx (이어서)
const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #ddd;
`;

const BookingStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  background-color: ${props => {
        switch (props.status) {
            case 'completed': return '#4caf50';
            case 'cancelled': return '#f44336';
            case 'pending': return '#ff9800';
            default: return '#999';
        }
    }};
`;

const BookingContent = styled.div`
  padding: 15px;
`;

const MovieInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const MoviePoster = styled.img`
  width: 100px;
  border-radius: 4px;
`;

const MovieDetails = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  font-weight: 600;
`;

const BookingInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 3px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #666;
`;

// 예시 예매 데이터 (실제로는 API에서 가져옵니다)
const mockBookings: Ticket[] = [
    {
        id: 1,
        screeningId: 1,
        userId: 1,
        seats: ['A1', 'A2'],
        ticketTypes: { adult: 2, teen: 0, child: 0 },
        totalPrice: 28000,
        paymentStatus: 'completed',
        bookingDate: '2025-09-28T14:30:00',
        // 추가 정보 (실제로는 API 응답에 포함될 수 있는 정보)
        movie: {
            id: 1,
            title: '듄: 파트 2',
            posterUrl: '/assets/images/posters/dune2.jpg',
        },
        theater: {
            name: '강남',
            screen: '2관 (IMAX)',
        },
        screening: {
            startTime: '2025-10-05T15:30:00',
        }
    },
    {
        id: 2,
        screeningId: 2,
        userId: 1,
        seats: ['C5', 'C6', 'C7'],
        ticketTypes: { adult: 2, teen: 1, child: 0 },
        totalPrice: 40000,
        paymentStatus: 'cancelled',
        bookingDate: '2025-09-15T10:15:00',
        // 추가 정보
        movie: {
            id: 2,
            title: '데드풀 & 울버린',
            posterUrl: '/assets/images/posters/deadpool.jpg',
        },
        theater: {
            name: '용산',
            screen: '1관',
        },
        screening: {
            startTime: '2025-09-20T19:00:00',
        }
    },
    {
        id: 3,
        screeningId: 3,
        userId: 1,
        seats: ['F8', 'F9'],
        ticketTypes: { adult: 1, teen: 1, child: 0 },
        totalPrice: 26000,
        paymentStatus: 'completed',
        bookingDate: '2025-08-05T16:45:00',
        // 추가 정보
        movie: {
            id: 3,
            title: '원더우먼 1984',
            posterUrl: '/assets/images/posters/wonderwoman.jpg',
        },
        theater: {
            name: '홍대',
            screen: '3관 (4DX)',
        },
        screening: {
            startTime: '2025-08-10T13:20:00',
        }
    },
];

const BookingHistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'current' | 'past' | 'cancelled'>('all');
    const [bookings, setBookings] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    // 예매 내역 가져오기 (실제로는 API 호출)
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                // 실제 API 호출 대신 목업 데이터 사용
                await new Promise(resolve => setTimeout(resolve, 500)); // API 호출 시뮬레이션

                setBookings(mockBookings);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    // 탭에 따라 예매 내역 필터링
    const filteredBookings = bookings.filter(booking => {
        const screeningDate = new Date(booking.screening?.startTime || '');
        const now = new Date();

        switch (activeTab) {
            case 'current':
                return screeningDate >= now && booking.paymentStatus === 'completed';
            case 'past':
                return screeningDate < now && booking.paymentStatus === 'completed';
            case 'cancelled':
                return booking.paymentStatus === 'cancelled';
            default:
                return true; // 'all'인 경우
        }
    });

    // 날짜 포맷 함수
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    // src/pages/BookingHistoryPage.tsx (이어서)
    // 예매 상태 텍스트 변환
    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed': return '예매 완료';
            case 'cancelled': return '예매 취소';
            case 'pending': return '결제 대기';
            default: return '알 수 없음';
        }
    };

    // 예매 취소 처리 함수
    const handleCancelBooking = (bookingId: number) => {
        if (window.confirm('예매를 취소하시겠습니까? 취소 시 환불 규정에 따라 처리됩니다.')) {
            // 실제로는 API 호출로 예매 취소 처리
            alert('예매가 취소되었습니다.');

            // UI 업데이트 (실제로는 API 응답 후 상태 업데이트)
            setBookings(bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, paymentStatus: 'cancelled' }
                    : booking
            ));
        }
    };

    if (loading) {
        return (
            <Container>
                <Title>예매 내역</Title>
                <div>예매 내역을 불러오는 중입니다...</div>
            </Container>
        );
    }

    return (
        <Container>
            <Title>예매 내역</Title>

            <Grid>
                <Sidebar>
                    <SidebarTitle>마이 메뉴</SidebarTitle>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarLink to="/mypage">회원 정보</SidebarLink>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarLink to="/mypage/bookings" active={true}>예매 내역</SidebarLink>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarLink to="/mypage/points">포인트</SidebarLink>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarLink to="/mypage/reviews">내가 쓴 리뷰</SidebarLink>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarLink to="/mypage/qna">1:1 문의</SidebarLink>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarLink to="/mypage/settings">설정</SidebarLink>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </Sidebar>

                <Content>
                    <TabContainer>
                        <Tab
                            active={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                        >
                            전체
                        </Tab>
                        <Tab
                            active={activeTab === 'current'}
                            onClick={() => setActiveTab('current')}
                        >
                            예매 내역
                        </Tab>
                        <Tab
                            active={activeTab === 'past'}
                            onClick={() => setActiveTab('past')}
                        >
                            지난 내역
                        </Tab>
                        <Tab
                            active={activeTab === 'cancelled'}
                            onClick={() => setActiveTab('cancelled')}
                        >
                            취소 내역
                        </Tab>
                    </TabContainer>

                    {filteredBookings.length > 0 ? (
                        filteredBookings.map(booking => {
                            const screeningDate = new Date(booking.screening?.startTime || '');
                            const now = new Date();
                            const isPast = screeningDate < now;
                            const isCancelled = booking.paymentStatus === 'cancelled';
                            const canCancel = !isPast && !isCancelled && booking.paymentStatus === 'completed';

                            return (
                                <BookingCard key={booking.id}>
                                    <BookingHeader>
                                        <div>예매번호: {booking.id}</div>
                                        <BookingStatus status={booking.paymentStatus}>
                                            {getStatusText(booking.paymentStatus)}
                                        </BookingStatus>
                                    </BookingHeader>

                                    <BookingContent>
                                        <MovieInfo>
                                            <MoviePoster src={booking.movie?.posterUrl} alt={booking.movie?.title} />
                                            <MovieDetails>
                                                <MovieTitle>{booking.movie?.title}</MovieTitle>
                                                <InfoItem>
                                                    <InfoLabel>극장/상영관</InfoLabel>
                                                    <InfoValue>{booking.theater?.name} / {booking.theater?.screen}</InfoValue>
                                                </InfoItem>
                                                <InfoItem>
                                                    <InfoLabel>상영 일시</InfoLabel>
                                                    <InfoValue>{formatDate(booking.screening?.startTime || '')}</InfoValue>
                                                </InfoItem>
                                            </MovieDetails>
                                        </MovieInfo>

                                        <BookingInfo>
                                            <InfoItem>
                                                <InfoLabel>좌석</InfoLabel>
                                                <InfoValue>{booking.seats.join(', ')}</InfoValue>
                                            </InfoItem>
                                            <InfoItem>
                                                <InfoLabel>인원</InfoLabel>
                                                <InfoValue>
                                                    {booking.ticketTypes.adult > 0 && `성인 ${booking.ticketTypes.adult}명 `}
                                                    {booking.ticketTypes.teen > 0 && `청소년 ${booking.ticketTypes.teen}명 `}
                                                    {booking.ticketTypes.child > 0 && `어린이 ${booking.ticketTypes.child}명`}
                                                </InfoValue>
                                            </InfoItem>
                                            <InfoItem>
                                                <InfoLabel>결제 금액</InfoLabel>
                                                <InfoValue>{booking.totalPrice.toLocaleString()}원</InfoValue>
                                            </InfoItem>
                                            <InfoItem>
                                                <InfoLabel>예매 일시</InfoLabel>
                                                <InfoValue>{formatDate(booking.bookingDate)}</InfoValue>
                                            </InfoItem>
                                        </BookingInfo>

                                        <ButtonGroup>
                                            {canCancel && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                >
                                                    예매 취소
                                                </Button>
                                            )}
                                            <Button
                                                variant={canCancel ? 'primary' : 'outline'}
                                                onClick={() => alert('준비 중인 기능입니다.')}
                                            >
                                                예매 상세
                                            </Button>
                                        </ButtonGroup>
                                    </BookingContent>
                                </BookingCard>
                            );
                        })
                    ) : (
                        <EmptyState>
                            <p>예매 내역이 없습니다.</p>
                        </EmptyState>
                    )}
                </Content>
            </Grid>
        </Container>
    );
};

export default BookingHistoryPage;