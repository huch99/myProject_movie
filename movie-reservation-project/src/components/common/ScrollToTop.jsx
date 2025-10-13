// src/components/common/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 페이지 이동 시 화면을 맨 위로 스크롤해주는 컴포넌트
 * App.js에 라우터 내부에 배치하여 사용합니다.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // 페이지 변경 시 스크롤 위치를 맨 위로 이동
        window.scrollTo(0, 0);
    }, [pathname]);

    return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
};

export default ScrollToTop;