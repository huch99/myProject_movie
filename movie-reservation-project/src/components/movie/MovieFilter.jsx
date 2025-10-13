import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { MOVIE_GENRES } from '../../constants/movieGenres';
import { FaFilter, FaChevronDown, FaChevronUp } from 'react-icons/fa';

/**
 * 영화 필터링 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.filter - 현재 적용된 필터
 * @param {Function} props.onFilterChange - 필터 변경 시 호출되는 콜백
 */
const MovieFilter = ({ filter = {}, onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState(filter.genre || '');
    const [selectedRating, setSelectedRating] = useState(filter.minRating || '');
    const [selectedSortBy, setSortBy] = useState(filter.sortBy || 'releaseDate');
    const [selectedSortOrder, setSortOrder] = useState(filter.sortOrder || 'desc');

    // 필터 변경 시 부모 컴포넌트에 알림
    useEffect(() => {
        onFilterChange({
            genre: selectedGenre,
            minRating: selectedRating,
            sortBy: selectedSortBy,
            sortOrder: selectedSortOrder
        });
    }, [selectedGenre, selectedRating, selectedSortBy, selectedSortOrder, onFilterChange]);

    // 필터 토글
    const toggleFilter = () => {
        setIsExpanded(!isExpanded);
    };

    // 필터 초기화
    const resetFilters = () => {
        setSelectedGenre('');
        setSelectedRating('');
        setSortBy('releaseDate');
        setSortOrder('desc');
    };

    // 장르 선택 핸들러
    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
    };

    // 평점 선택 핸들러
    const handleRatingChange = (e) => {
        setSelectedRating(e.target.value);
    };

    // 정렬 기준 선택 핸들러
    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
    };

    // 정렬 순서 선택 핸들러
    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    return (
        <FilterContainer>
            <FilterHeader onClick={toggleFilter}>
                <FilterTitle>
                    <FaFilter />
                    <span>필터</span>
                </FilterTitle>
                <ExpandButton>
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                </ExpandButton>
            </FilterHeader>

            {isExpanded && (
                <FilterContent>
                    <FilterGroup>
                        <FilterLabel>장르</FilterLabel>
                        <SelectInput
                            value={selectedGenre}
                            onChange={handleGenreChange}
                        >
                            <option value="">모든 장르</option>
                            {GENRE_LIST.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </SelectInput>
                    </FilterGroup>

                    <FilterGroup>
                        <FilterLabel>최소 평점</FilterLabel>
                        <SelectInput
                            value={selectedRating}
                            onChange={handleRatingChange}
                        >
                            <option value="">모든 평점</option>
                            <option value="9">9점 이상</option>
                            <option value="8">8점 이상</option>
                            <option value="7">7점 이상</option>
                            <option value="6">6점 이상</option>
                            <option value="5">5점 이상</option>
                            <option value="4">4점 이상</option>
                            <option value="3">3점 이상</option>
                            <option value="2">2점 이상</option>
                            <option value="1">1점 이상</option>
                        </SelectInput>
                    </FilterGroup>

                    <FilterGroup>
                        <FilterLabel>정렬 기준</FilterLabel>
                        <SelectInput
                            value={selectedSortBy}
                            onChange={handleSortByChange}
                        >
                            <option value="releaseDate">개봉일</option>
                            <option value="title">제목</option>
                            <option value="averageRating">평점</option>
                            <option value="popularity">인기도</option>
                        </SelectInput>
                    </FilterGroup>

                    <FilterGroup>
                        <FilterLabel>정렬 순서</FilterLabel>
                        <SelectInput
                            value={selectedSortOrder}
                            onChange={handleSortOrderChange}
                        >
                            <option value="desc">내림차순</option>
                            <option value="asc">오름차순</option>
                        </SelectInput>
                    </FilterGroup>

                    <FilterActions>
                        <ResetButton onClick={resetFilters}>
                            필터 초기화
                        </ResetButton>
                    </FilterActions>
                </FilterContent>
            )}
        </FilterContainer>
    );
};

// 장르 목록 배열
const GENRE_LIST = Object.values(MOVIE_GENRES).sort((a, b) => a.name.localeCompare(b.name, 'ko'));

// 스타일 컴포넌트
const FilterContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

const FilterTitle = styled.h3`
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const ExpandButton = styled.span`
  color: var(--color-text-secondary);
  transition: var(--transition-fast);
`;

const FilterContent = styled.div`
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border);
`;

const FilterGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  color: var(--color-text-primary);
`;

const SelectInput = styled.select`
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
  }
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing-md);
`;

const ResetButton = styled.button`
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-xs) var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
    color: var(--color-text-primary);
  }
`;

MovieFilter.propTypes = {
    filter: PropTypes.object,
    onFilterChange: PropTypes.func.isRequired
};

export default MovieFilter;