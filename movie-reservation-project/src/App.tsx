import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import MovieDetailPage from './pages/MovieDetailPage';
import TheaterPage from './pages/TheaterPage';
import TheaterDetailPage from './pages/TheaterDetailPage';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';
import BookingCompletePage from './pages/BookingCompletePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';
import BookingHistoryPage from './pages/BookingHistoryPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1.5;
    color: #333;
    background-color: #fafafa;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  button {
    cursor: pointer;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
`;

const App: React.FC = () => {

  return (
    <BrowserRouter>
      <AuthProvider> {/* AuthProvider로 전체 앱 래핑 */}
        <BookingProvider>
          <GlobalStyle />
          <AppContainer>
            <Header /> {/* useAuth 훅을 사용하므로 isLoggedIn prop 제거 */}
            <Main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/movies" element={<MoviesPage />} />
                <Route path="/movies/:id" element={<MovieDetailPage />} />
                <Route path="/theaters" element={<TheaterPage />} />
                <Route path="/theaters/:id" element={<TheaterDetailPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/booking/complete" element={<BookingCompletePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/mypage/bookings" element={<BookingHistoryPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Main>
            <Footer />
          </AppContainer>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;