import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchUserProfile, fetchRecentReservations } from '../store/slices/userSlice';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import UserProfileCard from '../components/user/UserProfileCard';
import ReservationCard from '../components/reservation/ReservationCard';
import MovieCard from '../components/movie/MovieCard';
import { FaTicketAlt, FaHeart, FaHistory, FaUser, FaGift, FaCreditCard } from 'react-icons/fa';
import ROUTE_PATHS from '../constants/routePaths';

/**
 * 마이페이지 메인 컴포넌트
 */
const MyPageMain = () => {
    const dispatch = useDispatch();
    const { user, recentReservations, loading } = useSelector(state => state.user);

    // 최근 본 영화 (localStorage에서 가져오기)
    const [recentMovies, setRecentMovies] = useState([]);

    useEffect(() => {
        // 사용자 프로필 및 최근 예매 내역 로드
        dispatch(fetchUserProfile());
        dispatch(fetchRecentReservations({ limit: 3 }));

        // localStorage에서 최근 본 영화 가져오기
        const recentViewedMovies = JSON.parse(localStorage.getItem('recentViewedMovies') || '[]');
        setRecentMovies(recentViewedMovies.slice(0, 3));
    }, [dispatch]);

    return (
        <Container>
            <PageTitle>마이페이지</PageTitle>

            <MyPageLayout>
                {/* 사이드바 - 사용자 정보 및 메뉴 */}
                <Sidebar>
                    <UserProfileCard user={user} loading={loading} />

                    <MenuSection>
                        <MenuTitle>나의 예매 정보</MenuTitle>
                        <MenuItem to={ROUTE_PATHS.RESERVATION_HISTORY}>
                            <MenuIcon><FaTicketAlt /></MenuIcon>
                            <MenuText>예매 내역</MenuText>
                        </MenuItem>
                        <MenuItem to={ROUTE_PATHS.WATCHED_MOVIES}>
                            <MenuIcon><FaHistory /></MenuIcon>
                            <MenuText>관람 내역</MenuText>
                        </MenuItem>
                        <MenuItem to={ROUTE_PATHS.FAVORITE_MOVIES}>
                            <MenuIcon><FaHeart /></MenuIcon>
                            <MenuText>찜한 영화</MenuText>
                        </MenuItem>
                    </MenuSection>

                    <MenuSection>
                        <MenuTitle>나의 계정 정보</MenuTitle>
                        <MenuItem to={ROUTE_PATHS.PROFILE_EDIT}>
                            <MenuIcon><FaUser /></MenuIcon>
                            <MenuText>회원 정보 수정</MenuText>
                        </MenuItem>
                        <MenuItem to={ROUTE_PATHS.PAYMENT_METHODS}>
                            <MenuIcon><FaCreditCard /></MenuIcon>
                            <MenuText>결제 수단 관리</MenuText>
                        </MenuItem>
                        <MenuItem to={ROUTE_PATHS.COUPONS}>
                            <MenuIcon><FaGift /></MenuIcon>
                            <MenuText>쿠폰함</MenuText>
                        </MenuItem>
                    </MenuSection>
                </Sidebar>

                {/* 메인 컨텐츠 */}
                <MainContent>
                    {/* 최근 예매 내역 */}
                    <ContentSection>
                        <SectionHeader>
                            <SectionTitle>
                                <SectionIcon><FaTicketAlt /></SectionIcon>
                                최근 예매 내역
                            </SectionTitle>
                            <ViewAllLink to={ROUTE_PATHS.RESERVATION_HISTORY}>
                                전체보기
                            </ViewAllLink>
                        </SectionHeader>

                        {loading ? (
                            <LoadingMessage>예매 내역을 불러오는 중입니다...</LoadingMessage>
                        ) : recentReservations && recentReservations.length > 0 ? (
                            <ReservationList>
                                {recentReservations.map(reservation => (
                                    <ReservationCard
                                        key={reservation.id}
                                        reservation={reservation}
                                        compact={true}
                                    />
                                ))}
                            </ReservationList>
                        ) : (
                            <EmptyMessage>
                                최근 예매 내역이 없습니다.
                                <EmptyActionLink to={ROUTE_PATHS.MOVIES}>영화 예매하러 가기</EmptyActionLink>
                            </EmptyMessage>
                        )}
                    </ContentSection>

                    {/* 최근 본 영화 */}
                    <ContentSection>
                        <SectionHeader>
                            <SectionTitle>
                                <SectionIcon><FaHistory /></SectionIcon>
                                최근 본 영화
                            </SectionTitle>
                        </SectionHeader>

                        {recentMovies.length > 0 ? (
                            <MovieGrid>
                                {recentMovies.map(movie => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        compact={true}
                                    />
                                ))}
                            </MovieGrid>
                        ) : (
                            <EmptyMessage>
                                최근 본 영화가 없습니다.
                                <EmptyActionLink to={ROUTE_PATHS.MOVIES}>영화 둘러보기</EmptyActionLink>
                            </EmptyMessage>
                        )}
                    </ContentSection>

                    {/* 찜한 영화 */}
                    <ContentSection>
                        <SectionHeader>
                            <SectionTitle>
                                <SectionIcon><FaHeart /></SectionIcon>
                                찜한 영화
                            </SectionTitle>
                            <ViewAllLink to={ROUTE_PATHS.FAVORITE_MOVIES}>
                                전체보기
                            </ViewAllLink>
                        </SectionHeader>

                        {loading ? (
                            <LoadingMessage>찜한 영화를 불러오는 중입니다...</LoadingMessage>
                        ) : user?.favoriteMovies && user.favoriteMovies.length > 0 ? (
                            <MovieGrid>
                                {user.favoriteMovies.slice(0, 3).map(movie => (
                                    <MovieCard
                                        key={movie.id}
                                        movie={movie}
                                        compact={true}
                                    />
                                ))}
                            </MovieGrid>
                        ) : (
                            <EmptyMessage>
                                찜한 영화가 없습니다.
                                <EmptyActionLink to={ROUTE_PATHS.MOVIES}>영화 둘러보기</EmptyActionLink>
                            </EmptyMessage>
                        )}
                    </ContentSection>
                </MainContent>
            </MyPageLayout>
        </Container>
    );
};

// 스타일 컴포넌트
const MyPageLayout = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  @media (max-width: 992px) {
    margin-bottom: var(--spacing-lg);
  }
`;

const MenuSection = styled.div`
  margin-top: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--box-shadow-sm);
`;

const MenuTitle = styled.h3`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
  color: var(--color-text-primary);
  text-decoration: none;
  border-radius: var(--border-radius-md);
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
    color: var(--color-primary);
  }
`;

const MenuIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: var(--spacing-sm);
  color: var(--color-primary);
`;

const MenuText = styled.span`
  font-size: var(--font-size-sm);
`;

const MainContent = styled.div``;

const ContentSection = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--box-shadow-sm);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  margin-right: var(--spacing-sm);
  color: var(--color-primary);
`;

const ViewAllLink = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ReservationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
`;

const EmptyMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  text-align: center;
`;

const EmptyActionLink = styled(Link)`
  margin-top: var(--spacing-sm);
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default MyPageMain;