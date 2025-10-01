import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import Button from '../components/common/Button';
import SectionTitle from '../components/common/SectionTitle';
import Spinner from '../components/common/Spinner';
import authService from '../service/authService';
import bookingService from '../service/bookingService';
import type { Ticket } from '../types/booking.types';
import type { User } from '../types/user.types';

const Container = styled.div`
  max-width: 1000px;
  margin: 50px auto;
  padding: 0 20px;
`;

const ProfileSection = styled.div`
  background-color: #f8f8f8;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  border: 3px solid #e51937;
`;

const Nickname = styled.h2`
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
`;

const Email = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
`;

const ProfileEditButton = styled(Link)`
  display: inline-block;
  background-color: #e51937;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c41730;
  }
`;

const BookingHistoryList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const BookingCard = styled(Link)`
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const BookingTitle = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 10px;
`;

const BookingDetail = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 5px;
  span {
    font-weight: 600;
    margin-right: 5px;
  }
`;

const NoBookings = styled.div`
  text-align: center;
  margin: 50px 0;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e51937;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 50px;
`;

const MyPage: React.FC = () => {
     const [userProfile, setUserProfile] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyPageData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. 사용자 프로필 정보 가져오기
        const profile = await authService.getUserProfile(); // API에서 최신 프로필 가져오기
        setUserProfile(profile);

        // 2. 예매 내역 가져오기
        const userBookings = await bookingService.getUserBookings();
        setBookings(userBookings);

      } catch (err) {
        console.error('마이페이지 데이터를 불러오는데 실패했습니다:', err);
        setError('데이터를 불러오는데 실패했습니다. 로그인 상태를 확인하거나 잠시 후 다시 시도해 주세요.');
        // 만약 인증 오류라면 로그인 페이지로 리다이렉트
        if (err instanceof Error && err.message.includes('인증')) { // 에러 메시지에 따라 조건 조정
            // navigate('/login'); // React Router의 useNavigate 훅 사용 (이 예제에서는 생략)
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []);

  if (loading) return <Container><Spinner /></Container>;
  if (error) return <Container><ErrorMessage>{error}</ErrorMessage></Container>;
  if (!userProfile) return <Container><NoBookings>사용자 정보를 불러올 수 없습니다.</NoBookings></Container>;

    return (
         <Container>
      <SectionTitle>마이페이지</SectionTitle>

      <ProfileSection>
        <ProfileImage src={userProfile.profileImage || 'https://via.placeholder.com/120'} alt="프로필 이미지" />
        <Nickname>{userProfile.nickname}</Nickname>
        <Email>{userProfile.email}</Email>
        <ProfileEditButton to="/my-page/edit">프로필 수정</ProfileEditButton>
      </ProfileSection>

      <SectionTitle>예매 내역</SectionTitle>
      {bookings.length === 0 ? (
        <NoBookings>예매 내역이 없습니다. 지금 영화를 예매해보세요!</NoBookings>
      ) : (
        <BookingHistoryList>
          {bookings.map((ticket) => (
            <BookingCard key={ticket.id} to={`/bookings/${ticket.id}`}>
              <BookingTitle>{ticket.screening?.movie.title}</BookingTitle>
              <BookingDetail><span>극장:</span> {ticket.screening?.theater.name}</BookingDetail>
              <BookingDetail><span>상영관:</span> {ticket.screening?.screen.name}</BookingDetail>
              <BookingDetail><span>시간:</span> {new Date(ticket.screening?.startTime || '').toLocaleString()}</BookingDetail>
              <BookingDetail><span>좌석:</span> {ticket.seats.join(', ')}</BookingDetail>
              <BookingDetail><span>총 가격:</span> {ticket.totalPrice.toLocaleString()}원</BookingDetail>
              <BookingDetail><span>예매일:</span> {new Date(ticket.bookingDate).toLocaleDateString()}</BookingDetail>
            </BookingCard>
          ))}
        </BookingHistoryList>
      )}
    </Container>
    );
};

export default MyPage;