// src/components/movie/MovieSlider.jsx
import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from '../../components/movie/MovieCard';


/**
 * 영화 카드 슬라이더 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.movies - 영화 목록 배열
 * @param {string} props.title - 슬라이더 제목
 * @param {string} props.subtitle - 슬라이더 부제목 (선택 사항)
 * @param {boolean} props.showRating - 평점 표시 여부
 */
const MovieSlider = ({ movies = [], title, subtitle, showRating = false }) => {
    const sliderRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    // 슬라이더가 비어있는 경우
    if (!movies || movies.length === 0) {
        return null;
    }

    // 스크롤 위치 체크
    const checkScrollPosition = () => {
        if (!sliderRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

        // 왼쪽 화살표 표시 여부
        setShowLeftArrow(scrollLeft > 0);

        // 오른쪽 화살표 표시 여부 (스크롤이 끝에 도달하면 숨김)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px 여유
    };

    // 왼쪽으로 스크롤
    const scrollLeft = () => {
        if (!sliderRef.current) return;

        const cardWidth = 220; // 카드 너비 + 여백
        const scrollAmount = cardWidth * 4; // 4개의 카드만큼 스크롤

        sliderRef.current.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });

        // 스크롤 후 위치 체크를 위한 타이머
        setTimeout(checkScrollPosition, 500);
    };

    // 오른쪽으로 스크롤
    const scrollRight = () => {
        if (!sliderRef.current) return;

        const cardWidth = 220; // 카드 너비 + 여백
        const scrollAmount = cardWidth * 4; // 4개의 카드만큼 스크롤

        sliderRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });

        // 스크롤 후 위치 체크를 위한 타이머
        setTimeout(checkScrollPosition, 500);
    };

    return (
        <SliderContainer>
            {/* 슬라이더 헤더 */}
            {(title || subtitle) && (
                <SliderHeader>
                    {title && <SliderTitle>{title}</SliderTitle>}
                    {subtitle && <SliderSubtitle>{subtitle}</SliderSubtitle>}
                </SliderHeader>
            )}

            {/* 슬라이더 컨테이너 */}
            <SliderContent>
                {showLeftArrow && (
                    <SliderArrow direction="left" onClick={scrollLeft}>
                        <FaChevronLeft />
                    </SliderArrow>
                )}

                <MoviesTrack
                    ref={sliderRef}
                    onScroll={checkScrollPosition}
                >
                    {movies.map(movie => (
                        <MovieCardWrapper key={movie.id}>
                            <MovieCard
                                movie={movie}
                                showRating={showRating}
                            />
                        </MovieCardWrapper>
                    ))}
                </MoviesTrack>

                {showRightArrow && (
                    <SliderArrow direction="right" onClick={scrollRight}>
                        <FaChevronRight />
                    </SliderArrow>
                )}
            </SliderContent>
        </SliderContainer>
    );
};

// 스타일 컴포넌트
const SliderContainer = styled.div`
  margin-bottom: var(--spacing-xl);
`;

const SliderHeader = styled.div`
  margin-bottom: var(--spacing-md);
`;

const SliderTitle = styled.h2`
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-primary);
`;

const SliderSubtitle = styled.p`
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin: 0;
`;

const SliderContent = styled.div`
  position: relative;
`;

const MoviesTrack = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: var(--spacing-sm) 0;
  
  /* 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const MovieCardWrapper = styled.div`
  flex: 0 0 auto;
  width: 200px;
  margin-right: var(--spacing-md);
`;

const SliderArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: -20px;' : 'right: -20px;'}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  z-index: 2;
  box-shadow: var(--box-shadow-sm);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

MovieSlider.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.string,
    subtitle: PropTypes.string,
    showRating: PropTypes.bool
};

export default MovieSlider;