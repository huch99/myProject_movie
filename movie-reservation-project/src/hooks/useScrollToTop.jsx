// 페이지 이동 시 스크롤 상단 이동 훅
import { useLocation } from 'react-router-dom';
import { useEffect } from "react";

/**
 * 페이지 이동 시 화면을 자동으로 최상단으로 스크롤하는 커스텀 훅
 * @param {Object} options - 스크롤 옵션 (behavior, top 등)
 */
const useScrollToTop = (options = { behavior: 'smooth', top: 0 }) => {
  const location = useLocation();
  
  useEffect(() => {
    // 페이지 경로가 변경될 때마다 스크롤을 최상단으로 이동
    window.scrollTo({
      top: options.top,
      behavior: options.behavior
    });
  }, [location.pathname, options]);
};

export default useScrollToTop;