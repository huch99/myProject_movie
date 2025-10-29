import React from 'react';
import { Link, Route } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 영화 정보를 카드 형태로 보여주는 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.movie - 영화 정보 객체
 * @param {boolean} props.showRating - 평점 표시 여부
 * @param {boolean} props.showReservation - 예매 버튼 표시 여부
 */
const MovieCard = ({ movie, showRating = true, showReservation = true }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);
    // 찜하기 토글 핸들러
    const handleFavoriteToggle = (e) => {
        e.preventDefault(); // 링크 이벤트 중지
        e.stopPropagation();

        if (!isAuthenticated) {
            // 로그인 필요 알림
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        // 찜하기 액션 디스패치 (실제 구현 시 추가)
        // dispatch(toggleFavoriteMovie(movie.id));
    };

    return (
        <CardContainer to={`${ROUTE_PATHS.MOVIE_DETAIL(movie.movieId)}`}>
            <PosterWrapper>
                <PosterImage src={movie.posterPath || '/images/default-poster.jpg'} alt={movie.title} />

                <CardOverlay>
                    <OverlayContent>
                        {showReservation && (
                            <ReservationButton to={`${ROUTE_PATHS.RESERVATION(movie.movieId)}`} onClick={(e) => e.stopPropagation()}>
                                예매하기
                            </ReservationButton>
                        )}
                        <DetailButton to={`${ROUTE_PATHS.MOVIE_DETAIL(movie.movieId)}`}>상세보기</DetailButton>
                    </OverlayContent>
                </CardOverlay>

                {movie.isScreening && <ScreeningBadge>상영중</ScreeningBadge>}
                {!movie.isScreening && movie.releaseDate && new Date(movie.releaseDate) > new Date() && (
                    <ComingSoonBadge>개봉예정</ComingSoonBadge>
                )}

                <FavoriteButton onClick={handleFavoriteToggle} $isFavorite={movie.isFavorite}>
                    <FaHeart />
                </FavoriteButton>
            </PosterWrapper>

            <CardContent>
                <MovieTitle>{movie.title}</MovieTitle>

                <MovieInfo>
                    {showRating && (
                        <Rating>
                            <FaStar />
                            <span>{movie.averageRating?.toFixed(1) || '0.0'}</span>
                        </Rating>
                    )}

                    <ReleaseInfo>
                        {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : ''}
                        {movie.runtime && ` · ${Math.floor(movie.runtime / 60)}시간 ${movie.runtime % 60}분`}
                    </ReleaseInfo>
                </MovieInfo>

                {movie.genres && (
                    <GenreList>
                        {movie.genres.slice(0, 2).map((genre, index) => (
                            <GenreTag key={index}>{genre.name}</GenreTag>
                        ))}
                    </GenreList>
                )}
            </CardContent>
        </CardContainer>
    );
};

// 스타일 컴포넌트
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--box-shadow-sm);
  transition: var(--transition-fast);
  text-decoration: none;
  color: var(--color-text-primary);
  height: 100%;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--box-shadow-md);
    
    ${({ theme }) => `
      ${CardOverlay} {
        opacity: 1;
      }
    `}
  }
`;

const PosterWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 150%; // 2:3 비율
  overflow: hidden;
`;

const PosterImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition-fast);
`;

const OverlayContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
`;

const ReservationButton = styled(Link)`
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary-dark, #d01830);
  }
`;

const DetailButton = styled(Link)`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  text-align: center;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const ScreeningBadge = styled.div`
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
  background-color: var(--color-secondary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${({ $isFavorite }) => ($isFavorite ? 'var(--color-primary)' : 'white')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-fast);
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
`;

const CardContent = styled.div`
  padding: var(--spacing-md);
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MovieTitle = styled.h3`
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-md);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`;

const MovieInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    color: #ffc107;
  }
`;

const ReleaseInfo = styled.div`
  font-size: var(--font-size-xs);
`;

const GenreList = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  margin-top: auto;
`;

const GenreTag = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.05));
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-sm);
`;

MovieCard.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        posterPath: PropTypes.string,
        averageRating: PropTypes.number,
        releaseDate: PropTypes.string,
        runtime: PropTypes.number,
        genres: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string
            })
        ),
        isScreening: PropTypes.bool,
        isFavorite: PropTypes.bool
    }).isRequired,
    showRating: PropTypes.bool,
    showReservation: PropTypes.bool
};

export default MovieCard;

