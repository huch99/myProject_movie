import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import ROUTE_PATHS from '../../constants/routePaths';
import Input from '../common/Input';
import { FaSearch, FaSun, FaMoon, FaSignOutAlt } from 'react-icons/fa';
import { clearAuthData, logoutUser } from '../../store/slices/authSlice'; // Redux action 임포트

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const { currentThemeName, toggleTheme } = useTheme(); // ThemeContext 훅 사용
  const [searchQuery, setSearchQuery] = useState('');

  // 검색 입력값 변경 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTE_PATHS.SEARCH}?query=${searchQuery}`);
      setSearchQuery(''); // 검색 후 입력창 비우기
    }
  };

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Redux action 디스패치
    } catch (err) {
      console.error('로그아웃 실패:', err);
      alert('로그아웃 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      dispatch(clearAuthData()); // Redux 상태 초기화
      navigate(ROUTE_PATHS.HOME);
    }
  };

  return (
    <HeaderContainer>
      <HeaderWrapper>
        {/* 로고 */}
        <Logo to={ROUTE_PATHS.HOME}>
          MOVIE<span>BOOKING</span>
        </Logo>

        {/* 메인 네비게이션 */}
        <Nav>
          <NavItem to={ROUTE_PATHS.MOVIES}>영화</NavItem>
          <NavItem to={ROUTE_PATHS.THEATERS}>극장</NavItem>
          <NavItem to={ROUTE_PATHS.RESERVATION()}>예매</NavItem> {/* 예매 페이지는 영화ID를 파라미터로 받도록 변경 */}
        </Nav>

        <RightSection>
          {/* 검색 바 */}
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInput
              type="text"
              placeholder="영화, 극장 검색"
              value={searchQuery}
              onChange={handleSearchChange}
              name="search"
              size="small"
              fullWidth
            />
            <SearchButton type="submit">
              <FaSearch />
            </SearchButton>
          </SearchForm>

          {/* 테마 토글 버튼 */}
          <ThemeToggleButton onClick={toggleTheme}>
            {currentThemeName === 'light' ? <FaMoon /> : <FaSun />}
          </ThemeToggleButton>

          {/* 사용자 메뉴 (로그인 상태에 따라 다름) */}
          {isAuthenticated ? (
            <UserMenu>
              <UserNickname to={ROUTE_PATHS.MYPAGE}>{user?.nickname || user?.username || '내 정보'}</UserNickname>
              <AuthButton variant="text" onClick={handleLogout} size="small">
                <FaSignOutAlt />
                로그아웃
              </AuthButton>
            </UserMenu>
          ) : (
            <AuthButtons>
              <AuthButton to={ROUTE_PATHS.LOGIN} variant="text" size="small">로그인</AuthButton>
              <AuthButton to={ROUTE_PATHS.REGISTER} variant="text" size="small">회원가입</AuthButton>
            </AuthButtons>
          )}
        </RightSection>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

// 스타일 컴포넌트
const HeaderContainer = styled.header`
  background-color: var(--color-background);
  box-shadow: var(--box-shadow-sm);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: var(--z-index-header);
`;

const HeaderWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const Logo = styled(Link)`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  span {
    font-size: var(--font-size-md);
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: var(--spacing-lg);

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    margin-bottom: var(--spacing-md);
  }
`;

const NavItem = styled(Link)`
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition-fast);

  &:hover {
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    font-size: var(--font-size-md);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    margin-top: var(--spacing-md);
  }

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
`;

const SearchForm = styled.form`
  position: relative;
  width: 250px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    order: 1; /* 모바일에서 검색창이 위로 오도록 */
  }
`;

const SearchInput = styled(Input)`
  padding-right: 40px; /* 아이콘 공간 확보 */
  font-size: var(--font-size-sm);
`;

const SearchButton = styled.button`
  position: absolute;
  right: 10px;
  color: var(--color-text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-md);
  transition: var(--transition-fast);

  &:hover {
    color: var(--color-primary);
  }
`;

const ThemeToggleButton = styled.button`
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-full);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: var(--transition-fast);

  &:hover {
    background-color: var(--color-surface);
    color: var(--color-primary);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: 2; /* 모바일에서 하단으로 */
  }
`;

const AuthButton = styled(Link)`
  ${({ size }) => `
    padding: ${size === 'small' ? '6px 10px' : '8px 16px'};
    font-size: ${size === 'small' ? 'var(--font-size-sm)' : 'var(--font-size-md)'};
  `}
  color: var(--color-primary);
  text-decoration: none;
  transition: var(--transition-fast);
  border-radius: var(--border-radius-md);

  &:hover {
    background-color: var(--color-surface);
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    order: 2;
  }
`;

const UserNickname = styled(Link)`
  font-weight: 500;
  text-decoration: none;
  color: var(--color-text-primary);
  
  &:hover {
    color: var(--color-primary);
  }
`;

export default Header;