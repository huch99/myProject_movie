import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
}

const HeaderContainer = styled.header`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #e51937;
  text-decoration: none;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  margin-left: 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #e51937;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const LoginButton = styled(Link)`
  margin-left: 15px;
  padding: 8px 15px;
  background: none;
  border: 1px solid #e51937;
  border-radius: 4px;
  color: #e51937;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: rgba(229, 25, 55, 0.1);
  }
`;

const SignupButton = styled(Link)`
  margin-left: 10px;
  padding: 8px 15px;
  background-color: #e51937;
  border: none;
  border-radius: 4px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: #c41730;
  }
`;

const LogoutButton = styled.button`
  margin-left: 15px;
  padding: 8px 15px;
  background: none;
  border: 1px solid #666;
  border-radius: 4px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333; // 아이콘 색상 추가
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  top: 70px; /* Header 높이에 맞춰 조정 */
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  border-top: 1px solid #eee; // 모바일 메뉴 상단에 경계선 추가
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  text-align: left; /* 좌측 정렬 */
  width: 100%; /* 전체 너비 차지 */
  background: none; /* 버튼으로 사용될 경우 배경 제거 */
  border: none; /* 버튼으로 사용될 경우 테두리 제거 */
  cursor: pointer;
  
  &:hover {
    background-color: #f8f8f8;
    color: #e51937; // 호버 시 색상 변경
  }

  // 로그아웃 버튼처럼 특정 스타일을 더하고 싶을 때
  &.logout-btn {
    color: #e51937; // 로그아웃은 중요한 액션이므로 강조
    font-weight: 600;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  font-weight: 500;
  margin-right: 5px;
`;

const Header: React.FC<HeaderProps> = () => {
  const { isLoggedIn, user, logout } = useAuth(); // useAuth 훅 사용
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // AuthContext의 logout 함수 사용
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">MovieFlix</Logo>

        <Navigation>
          <NavLink to="/movies">영화</NavLink>
          <NavLink to="/theaters">극장</NavLink>
          <NavLink to="/booking">예매</NavLink>
          <NavLink to="/events">이벤트</NavLink>
        </Navigation>

        <AuthButtons>
          {isLoggedIn ? (
            <>
              <UserInfo>
                <UserName>{user?.name}님</UserName>
              </UserInfo>
              <NavLink to="/mypage">마이페이지</NavLink>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </>
          ) : (
            <>
              <LoginButton to="/login">로그인</LoginButton>
              <SignupButton to="/register">회원가입</SignupButton>
            </>
          )}
        </AuthButtons>

        <MobileMenuButton onClick={toggleMenu}>
          ☰
        </MobileMenuButton>
      </HeaderContent>

      <MobileMenu $isOpen={menuOpen}>
        <MobileNavLink to="/movies" onClick={() => setMenuOpen(false)}>영화</MobileNavLink>
        <MobileNavLink to="/theaters" onClick={() => setMenuOpen(false)}>극장</MobileNavLink>
        <MobileNavLink to="/booking" onClick={() => setMenuOpen(false)}>예매</MobileNavLink>
        <MobileNavLink to="/events" onClick={() => setMenuOpen(false)}>이벤트</MobileNavLink>

        {isLoggedIn ? (
          <>
            <MobileNavLink to="/mypage" onClick={() => setMenuOpen(false)}>마이페이지</MobileNavLink>
            {/* MobileAuthButton 대신 MobileNavLink을 버튼으로 사용하여 로그아웃 */}
            <MobileNavLink to="#" as="button" className="logout-btn" onClick={() => { handleLogout(); setMenuOpen(false); }}>
              로그아웃
            </MobileNavLink>
          </>
        ) : (
          <>
            {/* MobileAuthButton 대신 MobileNavLink 사용 */}
            <MobileNavLink to="/login" onClick={() => setMenuOpen(false)}>로그인</MobileNavLink>
            <MobileNavLink to="/register" onClick={() => setMenuOpen(false)}>회원가입</MobileNavLink>
          </>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;