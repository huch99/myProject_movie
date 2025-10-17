import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetail from './components/movie/MovieDetail';
import MoviePage from './pages/MoviePage';
import TheaterPage from './pages/TheaterPage';
import TheaterDetail from './components/theater/TheaterDetail';
import ReservationPage from './pages/ReservationPage';
import PaymentPage from './pages/PaymentPage';
import PaymentCompletePage from './pages/PaymentCompletePage';
import MyPageMain from './pages/MyPageMain';
import ProfileEditPage from './pages/ProfileEditPage';
import ReservationHistory from './components/reservation/ReservationHistory';
import WatchedMoviesPage from './pages/WatchedMoviesPage';
import FavoriteMoviesPage from './pages/FavoriteMoviesPage';
import CouponsPage from './pages/CouponsPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import NotFoundPage from './pages/NotFoundPage';
import ROUTE_PATHS from './constants/routePaths';

// 인증이 필요한 라우트를 위한 보호 컴포넌트
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  if (!isAuthenticated) {
    // 로그인 페이지로 리다이렉트하고, 현재 경로를 state로 전달
    return <Navigate to={ROUTE_PATHS.LOGIN} state={{ from: window.location.pathname }} />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* 메인 레이아웃이 적용되는 라우트 */}
        <Route path="/" element={<MainLayout />}>
          {/* 홈 페이지 */}
          <Route index element={<HomePage />} />
          
          {/* 영화 관련 페이지 */}
          <Route path={ROUTE_PATHS.MOVIES} element={<MoviePage />} />
          <Route path={ROUTE_PATHS.MOVIE_DETAIL(':movieId')} element={<MovieDetail />} />
          
          {/* 극장 관련 페이지 */}
          <Route path={ROUTE_PATHS.THEATERS} element={<TheaterPage />} />
          <Route path={ROUTE_PATHS.THEATER_DETAIL(':theaterId')} element={<TheaterDetail />} />
          
          {/* 예매 관련 페이지 */}
          <Route 
            path={ROUTE_PATHS.RESERVATION(':movieId')} 
            element={
              <PrivateRoute>
                <ReservationPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.PAYMENT(':reservationId')} 
            element={
              <PrivateRoute>
                <PaymentPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.PAYMENT_COMPLETE} 
            element={
              <PrivateRoute>
                <PaymentCompletePage />
              </PrivateRoute>
            } 
          />
          
          {/* 마이페이지 관련 라우트 */}
          <Route 
            path={ROUTE_PATHS.MYPAGE} 
            element={
              <PrivateRoute>
                <MyPageMain />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.PROFILE_EDIT} 
            element={
              <PrivateRoute>
                <ProfileEditPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.RESERVATION_HISTORY} 
            element={
              <PrivateRoute>
                <ReservationHistory />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.WATCHED_MOVIES} 
            element={
              <PrivateRoute>
                <WatchedMoviesPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.FAVORITE_MOVIES} 
            element={
              <PrivateRoute>
                <FavoriteMoviesPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.COUPONS} 
            element={
              <PrivateRoute>
                <CouponsPage />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path={ROUTE_PATHS.PAYMENT_METHODS} 
            element={
              <PrivateRoute>
                <PaymentMethodsPage />
              </PrivateRoute>
            } 
          />
          
          {/* 인증 관련 페이지 */}
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
          
          {/* 404 페이지 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRouter;