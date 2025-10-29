// src/components/movie/MovieInfo.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaStar, FaRegClock, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import ROUTE_PATHS from '../../constants/routePaths';
import dateUtils from '../../utils/dateUtils';

/**
 * 영화 정보 표시 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.movie - 영화 정보 객체
 * @param {boolean} props.isFavorite - 찜 여부
 * @param {Function} props.onToggleFavorite - 찜하기/취소 핸들러
 */
const MovieInfo = ({ movie, isFavorite, onToggleFavorite }) => {
    if (!movie) return null;

    return (
        <InfoContainer>
            <PosterSection>
                <MoviePoster src={movie.posterPath || '/images/default-poster.jpg'} alt={movie.title} />
                <FavoriteButton
                    type="button"
                    onClick={onToggleFavorite}
                    isFavorite={isFavorite}
                    aria-label={isFavorite ? '찜 취소하기' : '찜하기'}
                >
                    <FaHeart />
                </FavoriteButton>
            </PosterSection>

            <InfoSection>
                <MovieTitle>{movie.title}</MovieTitle>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                    <OriginalTitle>{movie.originalTitle}</OriginalTitle>
                )}

                <InfoGrid>
                    <InfoItem>
                        <InfoLabel>개봉일</InfoLabel>
                        <InfoValue>
                            <FaCalendarAlt />
                            <span>{movie.releaseDate ? dateUtils.formatDate(movie.releaseDate) : '미정'}</span>
                        </InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>상영시간</InfoLabel>
                        <InfoValue>
                            <FaRegClock />
                            <span>{movie.runtime ? `${movie.runtime}분` : '미정'}</span>
                        </InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>평점</InfoLabel>
                        <InfoValue>
                            <FaStar style={{ color: '#ffc107' }} />
                            <span>{movie.averageRating ? movie.averageRating.toFixed(1) : '0.0'}</span>
                        </InfoValue>
                    </InfoItem>

                    <InfoItem>
                        <InfoLabel>장르</InfoLabel>
                        <InfoValue>
                            {movie.genres?.map(genre => genre.name).join(', ') || '정보 없음'}
                        </InfoValue>
                    </InfoItem>
                </InfoGrid>

                <ActionButtons>
                    <ReservationButton to={ROUTE_PATHS.RESERVATION(movie.movieId)}>
                        예매하기
                    </ReservationButton>
                    {/* <DetailButton to={ROUTE_PATHS.MOVIE_DETAIL(movie.movieId)}>
                        상세정보
                    </DetailButton> */}
                </ActionButtons>
            </InfoSection>
        </InfoContainer>
    );
};

// 스타일 컴포넌트
const InfoContainer = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PosterSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

const MoviePoster = styled.img`
  width: 240px;
  height: 360px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-md);
  
  @media (max-width: 768px) {
    width: 200px;
    height: 300px;
  }
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.isFavorite ? 'var(--color-primary)' : 'white'};
  font-size: var(--font-size-lg);
  transition: var(--transition-fast);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const InfoSection = styled.div`
  flex: 1;
`;

const MovieTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
`;

const OriginalTitle = styled.h3`
  font-size: var(--font-size-md);
  font-weight: 400;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const InfoLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const InfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 500;
  
  svg {
    color: var(--color-primary);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ReservationButton = styled(Link)`
  padding: var(--spacing-sm) var(--spacing-xl);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const DetailButton = styled(Link)`
  padding: var(--spacing-sm) var(--spacing-xl);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
  }
`;

MovieInfo.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        originalTitle: PropTypes.string,
        posterPath: PropTypes.string,
        releaseDate: PropTypes.string,
        runtime: PropTypes.number,
        averageRating: PropTypes.number,
        genres: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string
            })
        )
    }).isRequired,
    isFavorite: PropTypes.bool,
    onToggleFavorite: PropTypes.func
};

export default MovieInfo;