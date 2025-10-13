import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaStar, FaRegClock, FaCalendarAlt } from 'react-icons/fa';
import dateUtils from '../../utils/dateUtils';

/**
 * 영화 상세 정보를 표시하는 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.movie - 영화 정보 객체
 */
const MovieDetail = ({ movie }) => {
    if (!movie) return null;

    return (
        <DetailContainer>
            <MovieSummary>
                <SummarySection>
                    <SectionTitle>줄거리</SectionTitle>
                    <SummaryText>{movie.synopsis || '등록된 줄거리가 없습니다.'}</SummaryText>
                </SummarySection>

                <InfoSection>
                    <SectionTitle>영화 정보</SectionTitle>
                    <InfoGrid>
                        <InfoItem>
                            <InfoLabel>개봉일</InfoLabel>
                            <InfoValue>
                                <FaCalendarAlt />
                                {movie.releaseDate ? dateUtils.formatDateKorean(movie.releaseDate) : '미정'}
                            </InfoValue>
                        </InfoItem>

                        <InfoItem>
                            <InfoLabel>상영시간</InfoLabel>
                            <InfoValue>
                                <FaRegClock />
                                {movie.runtime ? `${movie.runtime}분` : '미정'}
                            </InfoValue>
                        </InfoItem>

                        <InfoItem>
                            <InfoLabel>관람등급</InfoLabel>
                            <InfoValue>{movie.rating || '미정'}</InfoValue>
                        </InfoItem>

                        <InfoItem>
                            <InfoLabel>장르</InfoLabel>
                            <InfoValue>
                                {movie.genres?.map(genre => genre.name).join(', ') || '미정'}
                            </InfoValue>
                        </InfoItem>

                        <InfoItem>
                            <InfoLabel>평점</InfoLabel>
                            <InfoValue>
                                <FaStar style={{ color: '#ffc107' }} />
                                {movie.averageRating?.toFixed(1) || '0.0'} ({movie.totalRatings || 0}명)
                            </InfoValue>
                        </InfoItem>

                        <InfoItem>
                            <InfoLabel>국가</InfoLabel>
                            <InfoValue>{movie.country || '미정'}</InfoValue>
                        </InfoItem>
                    </InfoGrid>
                </InfoSection>
            </MovieSummary>

            {movie.director && (
                <CreditSection>
                    <SectionTitle>감독</SectionTitle>
                    <CreditList>
                        <CreditItem>
                            <CreditImage
                                src={movie.director.profileImage || '/images/default-profile.jpg'}
                                alt={movie.director.name}
                            />
                            <CreditName>{movie.director.name}</CreditName>
                        </CreditItem>
                    </CreditList>
                </CreditSection>
            )}

            {movie.cast && movie.cast.length > 0 && (
                <CreditSection>
                    <SectionTitle>출연</SectionTitle>
                    <CreditList>
                        {movie.cast.map((actor, index) => (
                            <CreditItem key={index}>
                                <CreditImage
                                    src={actor.profileImage || '/images/default-profile.jpg'}
                                    alt={actor.name}
                                />
                                <CreditName>{actor.name}</CreditName>
                                {actor.role && <CreditRole>{actor.role}</CreditRole>}
                            </CreditItem>
                        ))}
                    </CreditList>
                </CreditSection>
            )}

            {movie.trailer && (
                <TrailerSection>
                    <SectionTitle>예고편</SectionTitle>
                    <TrailerWrapper>
                        <iframe
                            src={`https://www.youtube.com/embed/${getYoutubeId(movie.trailer)}`}
                            title={`${movie.title} 예고편`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </TrailerWrapper>
                </TrailerSection>
            )}
        </DetailContainer>
    );
};

// YouTube URL에서 ID 추출 함수
const getYoutubeId = (url) => {
    if (!url) return '';

    // YouTube URL 패턴 매칭
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : '';
};

// 스타일 컴포넌트
const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
`;

const MovieSummary = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummarySection = styled.div``;

const InfoSection = styled.div``;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
`;

const SummaryText = styled.p`
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: var(--color-text-primary);
  white-space: pre-line;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const InfoValue = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  
  svg {
    color: var(--color-primary);
  }
`;

const CreditSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const CreditList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
`;

const CreditItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100px;
`;

const CreditImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const CreditName = styled.div`
  font-size: var(--font-size-sm);
  font-weight: 500;
  margin-top: var(--spacing-xs);
  text-align: center;
`;

const CreditRole = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: center;
`;

const TrailerSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const TrailerWrapper = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 비율 */
  width: 100%;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius-md);
  }
`;

MovieDetail.propTypes = {
    movie: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
        originalTitle: PropTypes.string,
        synopsis: PropTypes.string,
        posterPath: PropTypes.string,
        backdropPath: PropTypes.string,
        releaseDate: PropTypes.string,
        runtime: PropTypes.number,
        rating: PropTypes.string,
        genres: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                name: PropTypes.string
            })
        ),
        averageRating: PropTypes.number,
        totalRatings: PropTypes.number,
        country: PropTypes.string,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
            profileImage: PropTypes.string
        }),
        cast: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                profileImage: PropTypes.string,
                role: PropTypes.string
            })
        ),
        trailer: PropTypes.string
    })
};

export default MovieDetail;