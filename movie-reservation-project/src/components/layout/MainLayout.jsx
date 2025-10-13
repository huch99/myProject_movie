import React from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import useScrollToTop from '../../hooks/useScrollToTop';

/**
 * 메인 레이아웃 컴포넌트
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 레이아웃 내부에 렌더링할 컨텐츠
 * @param {boolean} props.showSidebar - 사이드바 표시 여부
 * @param {string} props.sidebarType - 사이드바 타입 ('mypage', 'admin' 등)
 */
const MainLayout = ({ 
  children, 
  showSidebar = false, 
  sidebarType = 'mypage' 
}) => {
  // 페이지 이동 시 스크롤을 맨 위로
  useScrollToTop();
  
  // 현재 경로 확인
  const location = useLocation();
  const isMyPage = location.pathname.includes('/mypage');
  const isAdminPage = location.pathname.includes('/admin');
  
  // 사이드바 표시 여부 결정 (props로 전달된 값이 우선)
  const shouldShowSidebar = showSidebar || isMyPage || isAdminPage;
  
  // 사이드바 타입 결정 (props로 전달된 값이 우선)
  const sidebarTypeToUse = sidebarType || (isAdminPage ? 'admin' : 'mypage');

  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {shouldShowSidebar ? (
          <ContentWithSidebar>
            <SidebarContainer>
              <Sidebar type={sidebarTypeToUse} />
            </SidebarContainer>
            <PageContent>
              <Outlet />
            </PageContent>
          </ContentWithSidebar>
        ) : (
          <PageContent>
            <Outlet />
          </PageContent>
        )}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

// 스타일 컴포넌트
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
`;

const ContentWithSidebar = styled.div`
  display: flex;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SidebarContainer = styled.div`
  flex-shrink: 0;
`;

const PageContent = styled.div`
  flex: 1;
`;

export default MainLayout;