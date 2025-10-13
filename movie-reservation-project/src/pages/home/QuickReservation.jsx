// src/components/reservation/QuickReservation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies } from '../../store/slices/movieSlice';
import { fetchTheaters } from '../../store/slices/theaterSlice';
import { fetchAvailableDates } from '../../store/slices/reservationSlice';
import { FaCalendarAlt, FaMapMarkerAlt, FaFilm, FaSearch } from 'react-icons/fa';
import Button from '../../components/common/Button';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 빠른 예매 컴포넌트
 * 홈페이지나 사이드바에 위치하여 빠른 예매 기능 제공
 */
const QuickReservation = ({ compact = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux 상태
    const { movies, loading: moviesLoading } = useSelector(state => state.movies);
    const { theaters, loading: theatersLoading } = useSelector(state => state.theaters);
    const { availableDates, loading: datesLoading } = useSelector(state => state.reservation);

    // 로컬 상태
    const [selectedMovie, setSelectedMovie] = useState('');
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // 데이터 로드
    useEffect(() => {
        dispatch(fetchMovies({ page: 0, size: 20 }));
        dispatch(fetchTheaters());
    }, [dispatch]);

    // 영화 선택 시 해당 영화의 상영 가능 날짜 로드
    useEffect(() => {
        if (selectedMovie) {
            dispatch(fetchAvailableDates(selectedMovie));
        }
    }, [dispatch, selectedMovie]);

    // 폼 제출 핸들러
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedMovie) {
            alert('영화를 선택해주세요.');
            return;
        }

        // 예매 페이지로 이동
        navigate(ROUTE_PATHS.RESERVATION(selectedMovie), {
            state: {
                theaterId: selectedTheater || undefined,
                date: selectedDate || undefined
            }
        });
    };

    return (
        <QuickReservationContainer compact={compact}>
            <ReservationTitle compact={compact}>
                <FaSearch />
                <span>빠른 예매</span>
            </ReservationTitle>

            <ReservationForm onSubmit={handleSubmit}>
                <FormGroup>
                    <FormLabel compact={compact}>
                        <FaFilm />
                        <span>영화</span>
                    </FormLabel>
                    <SelectWrapper>
                        <Select
                            value={selectedMovie}
                            onChange={(e) => setSelectedMovie(e.target.value)}
                            required
                        >
                            <option value="">영화 선택</option>
                            {movies?.content?.map(movie => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.title}
                                </option>
                            ))}
                        </Select>
                    </SelectWrapper>
                </FormGroup>

                <FormGroup>
                    <FormLabel compact={compact}>
                        <FaMapMarkerAlt />
                        <span>극장</span>
                    </FormLabel>
                    <SelectWrapper>
                        <Select
                            value={selectedTheater}
                            onChange={(e) => setSelectedTheater(e.target.value)}
                        >
                            <option value="">극장 선택 (선택사항)</option>
                            {theaters?.content?.map(theater => (
                                <option key={theater.id} value={theater.id}>
                                    {theater.name}
                                </option>
                            ))}
                        </Select>
                    </SelectWrapper>
                </FormGroup>

                <FormGroup>
                    <FormLabel compact={compact}>
                        <FaCalendarAlt />
                        <span>날짜</span>
                    </FormLabel>
                    <SelectWrapper>
                        <Select
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            disabled={!selectedMovie}
                        >
                            <option value="">날짜 선택 (선택사항)</option>
                            {availableDates?.map((date, index) => (
                                <option key={index} value={date}>
                                    {new Date(date).toLocaleDateString()}
                                </option>
                            ))}
                        </Select>
                    </SelectWrapper>
                </FormGroup>

                <SubmitButton type="submit" fullWidth>
                    빠른 예매
                </SubmitButton>
            </ReservationForm>
        </QuickReservationContainer>
    );
};

// 스타일 컴포넌트
const QuickReservationContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: ${props => props.compact ? 'var(--spacing-sm)' : 'var(--spacing-lg)'};
  box-shadow: var(--box-shadow-sm);
  width: 100%;
`;

const ReservationTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: ${props => props.compact ? 'var(--font-size-md)' : 'var(--font-size-lg)'};
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  
  svg {
    color: var(--color-primary);
  }
`;

const ReservationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: ${props => props.compact ? 'var(--font-size-sm)' : 'var(--font-size-md)'};
  font-weight: 500;
  
  svg {
    color: var(--color-primary);
  }
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const Select = styled.select`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-background);
  font-size: var(--font-size-sm);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
  
  &:disabled {
    background-color: var(--color-surface-variant);
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  margin-top: var(--spacing-sm);
  background-color: var(--color-primary);
  color: white;
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

QuickReservation.propTypes = {
    compact: PropTypes.bool
};

export default QuickReservation;