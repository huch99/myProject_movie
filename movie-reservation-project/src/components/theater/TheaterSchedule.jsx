import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const TheaterSchedule = ({ schedules, screens, loading }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // 날짜별로 그룹화된 상영 일정 가져오기
  const getSchedulesByDate = () => {
    if (!schedules || schedules.length === 0) return {};
    
    return schedules.reduce((acc, schedule) => {
      const dateKey = format(new Date(schedule.startTime), 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(schedule);
      return acc;
    }, {});
  };
  
  // 선택된 날짜의 영화 목록 가져오기
  const getMoviesByDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dateSchedules = getSchedulesByDate()[dateKey] || [];
    
    // 영화별로 그룹화
    const movies = {};
    dateSchedules.forEach(schedule => {
      if (!movies[schedule.movieId]) {
        movies[schedule.movieId] = {
          id: schedule.movieId,
          title: schedule.movieTitle,
          poster: schedule.moviePoster,
          schedules: []
        };
      }
      movies[schedule.movieId].schedules.push(schedule);
    });
    
    return Object.values(movies);
  };
  
  // 상영관 이름 가져오기
  const getScreenName = (screenId) => {
    if (!screens || screens.length === 0) return '상영관 정보 없음';
    const screen = screens.find(s => s.screenId === screenId);
    return screen ? screen.name : '상영관 정보 없음';
  };
  
  // 다음 7일 날짜 배열 생성
  const getDateList = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dateList = getDateList();
  const movies = getMoviesByDate(selectedDate);
  
  if (loading) {
    return <LoadingWrapper>상영 일정을 불러오는 중입니다...</LoadingWrapper>;
  }
  
  return (
    <ScheduleContainer>
      <DateSelector>
        {dateList.map((date, index) => (
          <DateButton 
            key={index} 
            selected={format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')}
            onClick={() => setSelectedDate(date)}
          >
            <DayName>{format(date, 'E', { locale: ko })}</DayName>
            <DayNumber>{format(date, 'd')}</DayNumber>
          </DateButton>
        ))}
      </DateSelector>
      
      <ScheduleContent>
        {movies.length === 0 ? (
          <NoSchedules>선택하신 날짜에 상영 일정이 없습니다.</NoSchedules>
        ) : (
          movies.map(movie => (
            <MovieScheduleItem key={movie.id}>
              <MovieInfo onClick={() => setSelectedMovie(selectedMovie === movie.id ? null : movie.id)}>
                <MoviePoster src={movie.poster} alt={movie.title} />
                <MovieTitle>{movie.title}</MovieTitle>
                <ExpandIcon>{selectedMovie === movie.id ? '▼' : '▶'}</ExpandIcon>
              </MovieInfo>
              
              {selectedMovie === movie.id && (
                <ScheduleList>
                  {movie.schedules.map((schedule, index) => (
                    <ScheduleItem key={index}>
                      <ScheduleTime>
                        {format(new Date(schedule.startTime), 'HH:mm')}
                        <span>~{format(new Date(schedule.endTime), 'HH:mm')}</span>
                      </ScheduleTime>
                      <ScheduleInfo>
                        <ScreenName>{getScreenName(schedule.screenId)}</ScreenName>
                        <SeatInfo>
                          <span>{schedule.availableSeats}</span>/{schedule.totalSeats}석
                        </SeatInfo>
                      </ScheduleInfo>
                      <ReservationButton disabled={schedule.availableSeats === 0}>
                        {schedule.availableSeats === 0 ? '매진' : '예매'}
                      </ReservationButton>
                    </ScheduleItem>
                  ))}
                </ScheduleList>
              )}
            </MovieScheduleItem>
          ))
        )}
      </ScheduleContent>
    </ScheduleContainer>
  );
};

// Styled Components
const ScheduleContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const DateSelector = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
  background-color: #f9f9f9;
`;

const DateButton = styled.button`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  background: ${props => props.selected ? '#3498db' : 'transparent'};
  color: ${props => props.selected ? '#fff' : '#333'};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.selected ? '#3498db' : '#f0f0f0'};
  }
`;

const DayName = styled.span`
  font-size: 12px;
  margin-bottom: 4px;
`;

const DayNumber = styled.span`
  font-size: 16px;
  font-weight: 600;
`;

const ScheduleContent = styled.div`
  padding: 16px;
`;

const NoSchedules = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #888;
`;

const MovieScheduleItem = styled.div`
  margin-bottom: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const MovieInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  background-color: #f9f9f9;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MoviePoster = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 12px;
`;

const MovieTitle = styled.h3`
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
`;

const ExpandIcon = styled.span`
  font-size: 12px;
  color: #999;
`;

const ScheduleList = styled.div`
  padding: 12px;
  background-color: #f5f5f5;
`;

const ScheduleItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ScheduleTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  font-weight: 600;
  
  span {
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }
`;

const ScheduleInfo = styled.div`
  flex: 1;
  margin: 0 16px;
`;

const ScreenName = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

const SeatInfo = styled.div`
  font-size: 13px;
  color: #666;
  
  span {
    color: ${props => props.full ? '#e74c3c' : '#3498db'};
    font-weight: 600;
  }
`;

const ReservationButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.disabled ? '#ccc' : '#3498db'};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#2980b9'};
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
`;

export default TheaterSchedule;