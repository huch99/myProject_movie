import React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ROUTE_PATHS from '../../constants/routePaths';
import {
    FaUser,
    FaTicketAlt,
    FaHeart,
    FaComment,
    FaGift,
    FaCog,
    FaSignOutAlt
} from 'react-icons/fa';

const Sidebar = ({ type = 'mypage' }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    // 마이페이지 메뉴 항목
    const mypageMenuItems = [
        { id: 'info', path: ROUTE_PATHS.MYPAGE_INFO, label: '내 정보', icon: <FaUser /> },
        { id: 'reservations', path: ROUTE_PATHS.MYPAGE_RESERVATIONS, label: '예매 내역', icon: <FaTicketAlt /> },
        { id: 'favorites', path: '/mypage/favorites', label: '찜한 영화/극장', icon: <FaHeart /> },
        { id: 'reviews', path: ROUTE_PATHS.MYPAGE_REVIEWS, label: '내 리뷰', icon: <FaComment /> },
        { id: 'coupons', path: ROUTE_PATHS.MYPAGE_COUPONS, label: '쿠폰/포인트', icon: <FaGift /> },
        { id: 'settings', path: ROUTE_PATHS.MYPAGE_SETTINGS, label: '설정', icon: <FaCog /> },
    ];

    // 관리자 메뉴 항목 (필요시 추가)
    const adminMenuItems = [
        // 관리자 메뉴 항목 추가 가능
    ];

    // 현재 타입에 따른 메뉴 항목 선택
    const menuItems = type === 'admin' ? adminMenuItems : mypageMenuItems;

    return (
        <SidebarContainer>
            <UserInfoSection>
                <UserAvatar>
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="프로필" />
                    ) : (
                        <UserInitial>{user?.nickname?.charAt(0) || user?.username?.charAt(0) || '?'}</UserInitial>
                    )}
                </UserAvatar>
                <UserName>{user?.nickname || user?.username || '사용자'}</UserName>
                <UserEmail>{user?.email || 'email@example.com'}</UserEmail>
            </UserInfoSection>

            <MenuSection>
                {menuItems.map((item) => (
                    <MenuItem
                        key={item.id}
                        to={item.path}
                        $isActive={location.pathname === item.path}
                    >
                        <MenuIcon>{item.icon}</MenuIcon>
                        <MenuLabel>{item.label}</MenuLabel>
                    </MenuItem>
                ))}
            </MenuSection>

            <LogoutButton onClick={logout}>
                <FaSignOutAlt />
                <span>로그아웃</span>
            </LogoutButton>
        </SidebarContainer>
    );
};

// 스타일 컴포넌트
const SidebarContainer = styled.aside`
  width: 250px;
  min-height: 600px;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-md);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: var(--spacing-lg);
  }
`;

const UserInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInitial = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-2xl);
  font-weight: 600;
`;

const UserName = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const UserEmail = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const MenuSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  margin-bottom: auto;
`;

const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  text-decoration: none;
  color: ${props => props.$isActive ? 'var(--color-primary)' : 'var(--color-text-primary)'};
  border-radius: var(--border-radius-md);
  background-color: ${props => props.$isActive ? 'var(--color-surface-variant, rgba(229, 25, 55, 0.1))' : 'transparent'};
  font-weight: ${props => props.$isActive ? '600' : '400'};
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(229, 25, 55, 0.05));
  }
`;

const MenuIcon = styled.span`
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-md);
  display: flex;
  align-items: center;
`;

const MenuLabel = styled.span`
  font-size: var(--font-size-md);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding: var(--spacing-sm);
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: var(--font-size-md);
  
  &:hover {
    color: var(--color-error);
  }
`;

export default Sidebar;