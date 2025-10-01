import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface CarouselItem {
    id: string | number;
    imageUrl: string;
    title?: string;
    description?: string;
    link?: string;
}

interface CarouselProps {
    items: CarouselItem[];
    autoPlay?: boolean;
    interval?: number;
    showArrows?: boolean;
    showDots?: boolean;
    height?: string;
    aspectRatio?: string;
}

const CarouselContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CarouselTrack = styled.div<{ transform: string }>`
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: ${props => props.transform};
`;

const CarouselSlide = styled.div<{ aspectRatio?: string; height?: string }>`
  flex: 0 0 100%;
  position: relative;
  height: ${props => props.height || 'auto'};
  aspect-ratio: ${props => props.aspectRatio || '16/9'};
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CarouselContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
  color: white;
`;

const CarouselTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const CarouselDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.7);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(229, 25, 55, 0.3);
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const Dot = styled.button<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#e51937' : 'rgba(255, 255, 255, 0.6)'};
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: ${props => props.active ? '#e51937' : 'rgba(255, 255, 255, 0.8)'};
  }
  
  &:focus {
    outline: none;
  }
`;

const Carousel: React.FC<CarouselProps> = ({
    items,
    autoPlay = true,
    interval = 5000,
    showArrows = true,
    showDots = true,
    height,
    aspectRatio
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // 자동 재생 설정
    useEffect(() => {
        if (autoPlay && items.length > 1) {
            startAutoPlay();
        }

        return () => {
            if (autoPlayTimerRef.current) {
                clearInterval(autoPlayTimerRef.current);
            }
        };
    }, [autoPlay, interval, items.length, currentIndex]);

    const startAutoPlay = () => {
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
        }

        autoPlayTimerRef.current = setInterval(() => {
            goToNextSlide();
        }, interval);
    };

    const pauseAutoPlay = () => {
        if (autoPlayTimerRef.current) {
            clearInterval(autoPlayTimerRef.current);
            autoPlayTimerRef.current = null;
        }
    };

    const resumeAutoPlay = () => {
        if (autoPlay && !autoPlayTimerRef.current) {
            startAutoPlay();
        }
    };

    const goToPrevSlide = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentIndex(prev => (prev === 0 ? items.length - 1 : prev - 1));

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    const goToNextSlide = () => {
        if (isTransitioning) return;

        setIsTransitioning(true);
        setCurrentIndex(prev => (prev === items.length - 1 ? 0 : prev + 1));

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    const goToSlide = (index: number) => {
        if (isTransitioning || index === currentIndex) return;

        setIsTransitioning(true);
        setCurrentIndex(index);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 500);
    };

    return (
        <CarouselContainer
            onMouseEnter={pauseAutoPlay}
            onMouseLeave={resumeAutoPlay}
        >
            <CarouselTrack
                ref={trackRef}
                transform={`translateX(-${currentIndex * 100}%)`}
            >
                {items.map((item) => (
                    <CarouselSlide
                        key={item.id}
                        height={height}
                        aspectRatio={aspectRatio}
                    >
                        <CarouselImage src={item.imageUrl} alt={item.title || ''} />
                        {(item.title || item.description) && (
                            <CarouselContent>
                                {item.title && <CarouselTitle>{item.title}</CarouselTitle>}
                                {item.description && <CarouselDescription>{item.description}</CarouselDescription>}
                            </CarouselContent>
                        )}
                    </CarouselSlide>
                ))}
            </CarouselTrack>

            {showArrows && items.length > 1 && (
                <>
                    <ArrowButton
                        direction='left'
                        onClick={goToPrevSlide}
                        aria-label='이전 슬라이드'
                    >
                        <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M15 18L9 12L15 6' stroke='#333' strokeWidth="2" strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                    </ArrowButton>
                    <ArrowButton
                        direction='right'
                        onClick={goToNextSlide}
                        aria-label='다음 슬라이드'
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 6L15 12L9 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </ArrowButton>
                </>
            )}

            {showDots && items.length > 1 && (
                <DotsContainer>
                    {items.map((_, index) => (
                        <Dot
                            key={index}
                            active={index === currentIndex}
                            onClick={() => goToSlide(index)}
                            aria-label={`${index + 1}번 슬라이드로 이동`}
                        />
                    ))}
                </DotsContainer>
            )}
        </CarouselContainer>
    );
};

export default Carousel;