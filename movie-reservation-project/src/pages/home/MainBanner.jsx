// src/components/home/MainBanner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 메인 배너 슬라이더 컴포넌트
 * 
 * @param {Object} props
 * @param {Array} props.banners - 배너 이미지 및 정보 배열
 * @param {number} props.autoplaySpeed - 자동 슬라이드 속도 (ms)
 * @param {boolean} props.showIndicators - 인디케이터 표시 여부
 */
const MainBanner = ({ banners = [], autoplaySpeed = 5000, showIndicators = true }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);

    // 배너가 없을 경우
    if (!banners || banners.length === 0) {
        return null;
    }

    // 자동 슬라이드 효과
    useEffect(() => {
        let interval;

        if (isAutoplay && banners.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
            }, autoplaySpeed);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isAutoplay, banners.length, autoplaySpeed]);

    // 이전 배너로 이동
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
        setIsAutoplay(false);
    };

    // 다음 배너로 이동
    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setIsAutoplay(false);
    };

    // 특정 배너로 이동
    const goToIndex = (index) => {
        setCurrentIndex(index);
        setIsAutoplay(false);
    };

    // 마우스 이벤트 핸들러
    const handleMouseEnter = () => {
        setIsAutoplay(false);
    };

    const handleMouseLeave = () => {
        setIsAutoplay(true);
    };

    return (
        <BannerContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <BannerSlider style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {banners.map((banner, index) => (
                    <BannerSlide key={index}>
                        <BannerLink to={banner.link || ROUTE_PATHS.MOVIES}>
                            <BannerImage src={banner.imageUrl} alt={banner.title || `배너 이미지 ${index + 1}`} />
                            {banner.title && (
                                <BannerContent>
                                    <BannerTitle>{banner.title}</BannerTitle>
                                    {banner.description && (
                                        <BannerDescription>{banner.description}</BannerDescription>
                                    )}
                                </BannerContent>
                            )}
                        </BannerLink>
                    </BannerSlide>
                ))}
            </BannerSlider>

            {banners.length > 1 && (
                <>
                    <NavButton direction="prev" onClick={goToPrevious}>
                        <FaChevronLeft />
                    </NavButton>
                    <NavButton direction="next" onClick={goToNext}>
                        <FaChevronRight />
                    </NavButton>

                    {showIndicators && (
                        <BannerIndicators>
                            {banners.map((_, index) => (
                                <IndicatorDot
                                    key={index}
                                    active={index === currentIndex}
                                    onClick={() => goToIndex(index)}
                                />
                            ))}
                        </BannerIndicators>
                    )}
                </>
            )}
        </BannerContainer>
    );
};

// 스타일 컴포넌트
const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--box-shadow-md);
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const BannerSlider = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
`;

const BannerSlide = styled.div`
  min-width: 100%;
  height: 100%;
`;

const BannerLink = styled(Link)`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BannerContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--spacing-lg);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
`;

const BannerTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  
  @media (max-width: 768px) {
    font-size: var(--font-size-xl);
  }
`;

const BannerDescription = styled.p`
  font-size: var(--font-size-md);
  max-width: 70%;
  
  @media (max-width: 768px) {
    font-size: var(--font-size-sm);
    max-width: 100%;
  }
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'prev' ? 'left: 20px;' : 'right: 20px;'}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
  z-index: 2;
  
  &:hover {
    opacity: 1;
  }
`;

const BannerIndicators = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-xs);
  z-index: 2;
`;

const IndicatorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.6)'};
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.8)'};
  }
`;

MainBanner.propTypes = {
    banners: PropTypes.arrayOf(
        PropTypes.shape({
            imageUrl: PropTypes.string.isRequired,
            title: PropTypes.string,
            description: PropTypes.string,
            link: PropTypes.string
        })
    ),
    autoplaySpeed: PropTypes.number,
    showIndicators: PropTypes.bool
};

export default MainBanner;