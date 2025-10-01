import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    &.mobile-hidden {
      display: none;
    }
    &.mobile-visible {
      display: flex;
    }
    flex-direction: column;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 10px 20px;
    z-index: 100;
  }
`;

const NavLink = styled(RouterNavLink)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 4px;
  transition: all 0.3s;
  
  &:hover {
    background-color: rgba(229, 25, 55, 0.05);
  }
  
  &.active {
    color: #e51937;
    font-weight: 700;
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SubNavContainer = styled.div`
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 70px;
  background-color: #f8f8f8;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 99;
  
  &.active {
    display: block;
  }
`;

const SubNavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: space-around;
`;

const SubNavColumn = styled.div`
  flex: 1;
`;

const SubNavTitle = styled.h4`
  color: #333;
  margin-bottom: 10px;
  font-size: 1rem;
`;

const SubNavLink = styled(RouterNavLink)`
  display: block;
  color: #666;
  text-decoration: none;
  margin-bottom: 8px;
  font-size: 0.9rem;
  
  &:hover {
    color: #e51937;
  }
  
  &.active {
    color: #e51937;
    font-weight: 500;
  }
`;

const Navigation: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSubNav, setActiveSubNav] = useState<string | null>(null);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMouseEnter = (section: string) => {
        setActiveSubNav(section);
    };

    const handleMouseLeave = () => {
        setActiveSubNav(null);
    };

    return (
        <>
            <MobileMenuButton onClick={toggleMenu}>
                {isMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>

            <Nav className={isMenuOpen ? 'mobile-visible' : 'mobile-hidden'}>
                <NavLink
                    to="/movies"
                    className={location.pathname.startsWith('/movies') ? 'active' : ''}
                    onMouseEnter={() => handleMouseEnter('movies')}
                >
                    영화
                </NavLink>
                <NavLink
                    to="/theaters"
                    className={location.pathname.startsWith('/theaters') ? 'active' : ''}
                    onMouseEnter={() => handleMouseEnter('theaters')}
                >
                    극장
                </NavLink>
                <NavLink
                    to="/booking"
                    className={location.pathname.startsWith('/booking') ? 'active' : ''}
                    onMouseEnter={() => handleMouseEnter('booking')}
                >
                    예매
                </NavLink>
                <NavLink
                    to="/events"
                    className={location.pathname.startsWith('/events') ? 'active' : ''}
                    onMouseEnter={() => handleMouseEnter('events')}
                >
                    이벤트
                </NavLink>
                <NavLink
                    to="/store"
                    className={location.pathname.startsWith('/store') ? 'active' : ''}
                    onMouseEnter={() => handleMouseEnter('store')}
                >
                    스토어
                </NavLink>
                <NavLink
                    to="/benefits"
                    className={location.pathname.startsWith('/benefits') ? 'active' : ''}
                    onMouseEnter={() => handleMouseEnter('benefits')}
                >
                    혜택
                </NavLink>
            </Nav>

            {/* 서브 내비게이션 메뉴 */}
            <SubNavContainer
                className={activeSubNav === 'movies' ? 'active' : ''}
                onMouseEnter={() => setActiveSubNav('movies')}
                onMouseLeave={handleMouseLeave}
            >
                <SubNavContent>
                    <SubNavColumn>
                        <SubNavTitle>영화 정보</SubNavTitle>
                        <SubNavLink to="/movies/now-playing">현재 상영작</SubNavLink>
                        <SubNavLink to="/movies/coming-soon">상영 예정작</SubNavLink>
                        <SubNavLink to="/movies/top-rated">평점 높은 영화</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>영화 장르</SubNavTitle>
                        <SubNavLink to="/movies/genre/action">액션</SubNavLink>
                        <SubNavLink to="/movies/genre/comedy">코미디</SubNavLink>
                        <SubNavLink to="/movies/genre/drama">드라마</SubNavLink>
                        <SubNavLink to="/movies/genre/horror">공포</SubNavLink>
                        <SubNavLink to="/movies/genre/romance">로맨스</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>특별관</SubNavTitle>
                        <SubNavLink to="/movies/special/imax">IMAX</SubNavLink>
                        <SubNavLink to="/movies/special/4dx">4DX</SubNavLink>
                        <SubNavLink to="/movies/special/screenx">SCREENX</SubNavLink>
                        <SubNavLink to="/movies/special/dolby">돌비 시네마</SubNavLink>
                    </SubNavColumn>
                </SubNavContent>
            </SubNavContainer>

            <SubNavContainer
                className={activeSubNav === 'theaters' ? 'active' : ''}
                onMouseEnter={() => setActiveSubNav('theaters')}
                onMouseLeave={handleMouseLeave}
            >
                <SubNavContent>
                    <SubNavColumn>
                        <SubNavTitle>지역별 극장</SubNavTitle>
                        <SubNavLink to="/theaters/seoul">서울</SubNavLink>
                        <SubNavLink to="/theaters/gyeonggi">경기</SubNavLink>
                        <SubNavLink to="/theaters/incheon">인천</SubNavLink>
                        <SubNavLink to="/theaters/busan">부산</SubNavLink>
                        <SubNavLink to="/theaters/daegu">대구</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>특별관</SubNavTitle>
                        <SubNavLink to="/theaters/special/imax">IMAX</SubNavLink>
                        <SubNavLink to="/theaters/special/4dx">4DX</SubNavLink>
                        <SubNavLink to="/theaters/special/screenx">SCREENX</SubNavLink>
                        <SubNavLink to="/theaters/special/dolby">돌비 시네마</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>극장 서비스</SubNavTitle>
                        <SubNavLink to="/theaters/service/parking">주차 안내</SubNavLink>
                        <SubNavLink to="/theaters/service/vip">VIP 라운지</SubNavLink>
                        <SubNavLink to="/theaters/service/membership">멤버십 혜택</SubNavLink>
                    </SubNavColumn>
                </SubNavContent>
            </SubNavContainer>

            <SubNavContainer
                className={activeSubNav === 'booking' ? 'active' : ''}
                onMouseEnter={() => setActiveSubNav('booking')}
                onMouseLeave={handleMouseLeave}
            >
                <SubNavContent>
                    <SubNavColumn>
                        <SubNavTitle>예매 서비스</SubNavTitle>
                        <SubNavLink to="/booking/movie">영화별 예매</SubNavLink>
                        <SubNavLink to="/booking/theater">극장별 예매</SubNavLink>
                        <SubNavLink to="/booking/date">날짜별 예매</SubNavLink>
                        <SubNavLink to="/booking/special">특별관 예매</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>나의 예매 내역</SubNavTitle>
                        <SubNavLink to="/mypage/bookings/current">현재 예매 내역</SubNavLink>
                        <SubNavLink to="/mypage/bookings/past">지난 예매 내역</SubNavLink>
                        <SubNavLink to="/mypage/bookings/canceled">취소된 예매</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>결제 안내</SubNavTitle>
                        <SubNavLink to="/booking/payment/info">결제 방법 안내</SubNavLink>
                        <SubNavLink to="/booking/discount">할인 혜택 안내</SubNavLink>
                        <SubNavLink to="/booking/refund">환불 규정 안내</SubNavLink>
                    </SubNavColumn>
                </SubNavContent>
            </SubNavContainer>

            {/* 이벤트 서브 내비게이션 */}
            <SubNavContainer
                className={activeSubNav === 'events' ? 'active' : ''}
                onMouseEnter={() => setActiveSubNav('events')}
                onMouseLeave={handleMouseLeave}
            >
                <SubNavContent>
                    <SubNavColumn>
                        <SubNavTitle>이벤트</SubNavTitle>
                        <SubNavLink to="/events/ongoing">진행중인 이벤트</SubNavLink>
                        <SubNavLink to="/events/upcoming">예정된 이벤트</SubNavLink>
                        <SubNavLink to="/events/ended">종료된 이벤트</SubNavLink>
                        <SubNavLink to="/events/winners">당첨자 발표</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>프로모션</SubNavTitle>
                        <SubNavLink to="/events/promotion/discount">할인 프로모션</SubNavLink>
                        <SubNavLink to="/events/promotion/preview">시사회</SubNavLink>
                        <SubNavLink to="/events/promotion/special">스페셜 이벤트</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>제휴 혜택</SubNavTitle>
                        <SubNavLink to="/events/partners/card">카드사 제휴</SubNavLink>
                        <SubNavLink to="/events/partners/telecom">통신사 제휴</SubNavLink>
                        <SubNavLink to="/events/partners/point">포인트 제휴</SubNavLink>
                    </SubNavColumn>
                </SubNavContent>
            </SubNavContainer>

            {/* 스토어 서브 내비게이션 */}
            <SubNavContainer
                className={activeSubNav === 'store' ? 'active' : ''}
                onMouseEnter={() => setActiveSubNav('store')}
                onMouseLeave={handleMouseLeave}
            >
                <SubNavContent>
                    <SubNavColumn>
                        <SubNavTitle>스토어</SubNavTitle>
                        <SubNavLink to="/store/ticket">영화 관람권</SubNavLink>
                        <SubNavLink to="/store/combo">콤보</SubNavLink>
                        <SubNavLink to="/store/snack">스낵</SubNavLink>
                        <SubNavLink to="/store/drink">음료</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>기프트샵</SubNavTitle>
                        <SubNavLink to="/store/gift/card">기프트카드</SubNavLink>
                        <SubNavLink to="/store/gift/merchandise">영화 굿즈</SubNavLink>
                        <SubNavLink to="/store/gift/package">패키지</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>이용 안내</SubNavTitle>
                        <SubNavLink to="/store/guide/payment">결제 방법</SubNavLink>
                        <SubNavLink to="/store/guide/delivery">배송 안내</SubNavLink>
                        <SubNavLink to="/store/guide/refund">환불 규정</SubNavLink>
                    </SubNavColumn>
                </SubNavContent>
            </SubNavContainer>

            {/* 혜택 서브 내비게이션 */}
            <SubNavContainer
                className={activeSubNav === 'benefits' ? 'active' : ''}
                onMouseEnter={() => setActiveSubNav('benefits')}
                onMouseLeave={handleMouseLeave}
            >
                <SubNavContent>
                    <SubNavColumn>
                        <SubNavTitle>멤버십</SubNavTitle>
                        <SubNavLink to="/benefits/membership/vip">VIP 혜택</SubNavLink>
                        <SubNavLink to="/benefits/membership/general">일반 회원 혜택</SubNavLink>
                        <SubNavLink to="/benefits/membership/point">포인트 적립/사용</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>제휴 카드</SubNavTitle>
                        <SubNavLink to="/benefits/cards/credit">신용카드</SubNavLink>
                        <SubNavLink to="/benefits/cards/debit">체크카드</SubNavLink>
                        <SubNavLink to="/benefits/cards/prepaid">선불카드</SubNavLink>
                    </SubNavColumn>
                    <SubNavColumn>
                        <SubNavTitle>할인 정보</SubNavTitle>
                        <SubNavLink to="/benefits/discount/regular">정기 할인</SubNavLink>
                        <SubNavLink to="/benefits/discount/special">특별 할인</SubNavLink>
                        <SubNavLink to="/benefits/discount/group">단체 할인</SubNavLink>
                    </SubNavColumn>
                </SubNavContent>
            </SubNavContainer>
        </>
    );
};

export default Navigation;