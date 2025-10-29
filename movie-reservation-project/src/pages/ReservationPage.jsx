// 예매 페이지
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    fetchMovieDetails,
} from '../store/slices/movieSlice';
import {
    selectSeat,
    updateAudienceCount,
    updateTimer,
    resetTimer,
    setPaymentInfo,
    clearReservation
} from '../store/slices/reservationSlice';
import SeatSelector from '../components/reservation/SeatSelector';
import AudienceCounter from '../components/reservation/AudienceCounter';
import MovieInfo from '../components/movie/MovieInfo';
import ScheduleInfo from '../components/schedule/ScheduleInfo';
import ReservationSummary from '../components/reservation/ReservationSummary';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import CouponSelector from '../components/payment/CouponSelector';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import useScrollToTop from '../hooks/useScrollToTop';

const ReservationPage = () => {
    // 스크롤을 맨 위로 이동
    useScrollToTop();

    const { movieId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentMovie } = useSelector((state) => state.movies);
    const {
        selectedScreening,
        selectedSeats,
        audienceCount,
        priceDetails,
        timeRemaining,
        timerActive,
        loading,
        error
    } = useSelector((state) => state.reservations);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const [step, setStep] = useState('seats'); // 'seats', 'payment', 'complete'
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // 영화 정보 로드
    useEffect(() => {
        if (movieId) {
            dispatch(fetchMovieDetails(movieId));
        }
    }, [dispatch, movieId]);

    // 타이머 업데이트
    useEffect(() => {
        if (timerActive && step === 'seats') {
            const interval = setInterval(() => {
                dispatch(updateTimer(timeRemaining - 1));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [dispatch, timerActive, timeRemaining, step]);

    // 인증 상태 확인
    useEffect(() => {
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login', { state: { from: `/reservations/${movieId}` } });
        }
    }, [isAuthenticated, navigate, movieId]);

    // 상영 정보 확인
    // useEffect(() => {
    //     if (!selectedScreening && currentMovie) {
    //         console.log('*****************');
    //         navigate(`/movies/${movieId}`);
    //     }
    // }, [selectedScreening, currentMovie, navigate, movieId]);

    // 예매 정보 초기화 (페이지 언마운트 시)
    useEffect(() => {
        return () => {
            if (step === 'complete') {
                dispatch(clearReservation());
            }
        };
    }, [dispatch, step]);

    // 포맷된 타이머 표시
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 관객 수 변경 핸들러
    const handleAudienceCountChange = ( newCount ) => {
        Object.keys(newCount).forEach(type => {
            dispatch(updateAudienceCount({ type: type, count: newCount[type] }));
        });
        // dispatch(updateAudienceCount({ type, count }));
    };

    // 좌석 선택 핸들러
    const handleSeatSelect = (seat) => {
        dispatch(selectSeat(seat));
    };

    // 타이머 리셋 핸들러
    const handleResetTimer = () => {
        dispatch(resetTimer());
    };

    // 결제 방법 선택 핸들러
    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
    };

    // 약관 동의 핸들러
    const handleTermsAgreement = (e) => {
        setAgreedToTerms(e.target.checked);
    };

    // 다음 단계로 이동 핸들러
    const handleNextStep = () => {
        if (step === 'seats') {
            // 좌석 선택 완료 검증
            const totalAudience = Object.values(audienceCount).reduce((sum, count) => sum + count, 0);
            if (selectedSeats.length !== totalAudience) {
                alert(`선택하신 인원 수(${totalAudience}명)에 맞게 좌석을 선택해 주세요.`);
                return;
            }
            setStep('payment');
        } else if (step === 'payment') {
            // 결제 정보 검증
            if (!paymentMethod) {
                alert('결제 방법을 선택해 주세요.');
                return;
            }

            if (!agreedToTerms) {
                alert('예매 약관에 동의해 주세요.');
                return;
            }

            // 결제 정보 저장
            dispatch(setPaymentInfo({
                method: paymentMethod,
                totalAmount: priceDetails.totalPrice,
                date: new Date().toISOString()
            }));

            // 결제 처리 (실제 구현 시 결제 API 연동 필요)
            // 결제 성공 후 예매 완료 페이지로 이동
            setStep('complete');
        } else if (step === 'complete') {
            // 예매 완료 후 홈으로 이동
            dispatch(clearReservation());
            navigate('/');
        }
    };

    // 이전 단계로 이동 핸들러
    const handlePrevStep = () => {
        if (step === 'payment') {
            setStep('seats');
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <ErrorContainer>
                <h2>예매 정보를 불러오는데 실패했습니다.</h2>
                <p>{error}</p>
                <Button onClick={() => navigate(-1)}>이전 페이지로 돌아가기</Button>
            </ErrorContainer>
        );
    }

    if (!currentMovie ) { //|| !selectedScreening
        return (
            <ErrorContainer>
                <h2>예매 정보를 찾을 수 없습니다.</h2>
                <Button onClick={() => navigate('/')}>홈으로 돌아가기</Button>
            </ErrorContainer>
        );
    }

    return (
        <ReservationContainer>
            <ReservationHeader>
                <h1>{step === 'complete' ? '예매 완료' : '예매하기'}</h1>
                <ReservationProgress>
                    <ProgressStep active={true}>
                        <StepNumber>1</StepNumber>
                        <StepLabel>상영 선택</StepLabel>
                    </ProgressStep>
                    <ProgressLine />
                    <ProgressStep active={true}>
                        <StepNumber>2</StepNumber>
                        <StepLabel>좌석 선택</StepLabel>
                    </ProgressStep>
                    <ProgressLine />
                    <ProgressStep active={step === 'payment' || step === 'complete'}>
                        <StepNumber>3</StepNumber>
                        <StepLabel>결제</StepLabel>
                    </ProgressStep>
                    <ProgressLine />
                    <ProgressStep active={step === 'complete'}>
                        <StepNumber>4</StepNumber>
                        <StepLabel>예매 완료</StepLabel>
                    </ProgressStep>
                </ReservationProgress>
            </ReservationHeader>

            {step === 'seats' && (
                <SeatSelectionSection>
                    <TimerContainer>
                        <TimerLabel>좌석 선택 남은 시간</TimerLabel>
                        <Timer isLow={timeRemaining < 60}>
                            {formatTime(timeRemaining)}
                            <ResetButton onClick={handleResetTimer}>시간 연장</ResetButton>
                        </Timer>
                    </TimerContainer>

                    <ReservationContentWrapper>
                        <SeatSelectionContainer>
                            <AudienceSection>
                                <SectionTitle>인원 선택</SectionTitle>
                                <AudienceCounter
                                    audienceCount={audienceCount}
                                    onChange={handleAudienceCountChange}
                                />
                            </AudienceSection>

                            <SeatSection>
                                <SectionTitle>좌석 선택</SectionTitle>
                                {/* <SeatSelector
                                    screeningId={selectedScreening.id}
                                    selectedSeats={selectedSeats}
                                    onSeatSelect={handleSeatSelect}
                                    maxSeats={Object.values(audienceCount).reduce((sum, count) => sum + count, 0)}
                                /> */}
                            </SeatSection>
                        </SeatSelectionContainer>

                        <ReservationSummaryContainer>
                            <MovieInfo movie={currentMovie} />
                            <ScheduleInfo screening={selectedScreening} />
                            <ReservationSummary
                                selectedSeats={selectedSeats}
                                audienceCount={audienceCount}
                                priceDetails={priceDetails}
                            />
                            <NextButton
                                onClick={handleNextStep}
                                disabled={selectedSeats.length === 0 || Object.values(audienceCount).every(count => count === 0)}
                            >
                                결제하기
                            </NextButton>
                        </ReservationSummaryContainer>
                    </ReservationContentWrapper>
                </SeatSelectionSection>
            )}

            {step === 'payment' && (
                <PaymentSection>
                    <ReservationContentWrapper>
                        <PaymentContainer>
                            <SectionTitle>결제 수단 선택</SectionTitle>
                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onSelectMethod={handlePaymentMethodSelect}
                            />

                            <SectionTitle>쿠폰 / 포인트</SectionTitle>
                            <CouponSelector />

                            <TermsSection>
                                <SectionTitle>예매 동의</SectionTitle>
                                <TermsAgreement>
                                    <input
                                        type="checkbox"
                                        id="termsAgree"
                                        checked={agreedToTerms}
                                        onChange={handleTermsAgreement}
                                    />
                                    <label htmlFor="termsAgree">
                                        예매 내용 확인 및 이용약관에 동의합니다.
                                    </label>
                                </TermsAgreement>
                                <TermsContent>
                                    ※ 예매 완료 후 취소 및 환불은 영화관 이용약관에 따릅니다.
                                    <br />
                                    ※ 상영 시작 시간 이후에는 취소 및 환불이 불가능합니다.
                                    <br />
                                    ※ 결제 완료 후 예매번호가 발급되면 예매가 완료됩니다.
                                </TermsContent>
                            </TermsSection>
                        </PaymentContainer>

                        <ReservationSummaryContainer>
                            <MovieInfo movie={currentMovie} />
                            <ScheduleInfo screening={selectedScreening} />
                            <ReservationSummary
                                selectedSeats={selectedSeats}
                                audienceCount={audienceCount}
                                priceDetails={priceDetails}
                            />
                            <ButtonGroup>
                                <BackButton onClick={handlePrevStep}>
                                    이전 단계
                                </BackButton>
                                <NextButton onClick={handleNextStep}>
                                    결제하기
                                </NextButton>
                            </ButtonGroup>
                        </ReservationSummaryContainer>
                    </ReservationContentWrapper>
                </PaymentSection>
            )}

            {step === 'complete' && (
                <CompleteSection>
                    <CompleteMessage>
                        <CompleteIcon>✓</CompleteIcon>
                        <h2>예매가 완료되었습니다!</h2>
                        <p>예매 내역은 마이페이지에서 확인하실 수 있습니다.</p>
                    </CompleteMessage>

                    <ReservationContentWrapper>
                        <CompleteDetailsContainer>
                            <SectionTitle>예매 정보</SectionTitle>
                            <CompleteDetails>
                                <DetailItem>
                                    <DetailLabel>예매번호</DetailLabel>
                                    <DetailValue>M{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</DetailValue>
                                </DetailItem>
                                <DetailItem>
                                    <DetailLabel>결제일시</DetailLabel>
                                    <DetailValue>{new Date().toLocaleString()}</DetailValue>
                                </DetailItem>
                                <DetailItem>
                                    <DetailLabel>결제금액</DetailLabel>
                                    <DetailValue>{priceDetails.totalPrice.toLocaleString()}원</DetailValue>
                                </DetailItem>
                                <DetailItem>
                                    <DetailLabel>결제수단</DetailLabel>
                                    <DetailValue>{paymentMethod}</DetailValue>
                                </DetailItem>
                            </CompleteDetails>
                        </CompleteDetailsContainer>

                        <ReservationSummaryContainer>
                            <MovieInfo movie={currentMovie} />
                            <ScheduleInfo screening={selectedScreening} />
                            <ReservationSummary
                                selectedSeats={selectedSeats}
                                audienceCount={audienceCount}
                                priceDetails={priceDetails}
                            />
                            <ButtonGroup>
                                <HomeButton onClick={() => navigate('/')}>
                                    홈으로
                                </HomeButton>
                                <MyPageButton onClick={() => navigate('/mypage/reservations')}>
                                    예매내역 보기
                                </MyPageButton>
                            </ButtonGroup>
                        </ReservationSummaryContainer>
                    </ReservationContentWrapper>
                </CompleteSection>
            )}
        </ReservationContainer>
    );
};

// 스타일 컴포넌트
const ReservationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md);
`;

const ReservationHeader = styled.div`
  margin-bottom: var(--spacing-xl);
  
  h1 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    text-align: center;
  }
`;

const ReservationProgress = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
`;

const ProgressStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ active }) => active ? 1 : 0.5};
`;

const StepNumber = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ active }) => active ? 'var(--color-primary)' : 'var(--color-border)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const StepLabel = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const ProgressLine = styled.div`
  flex: 1;
  height: 2px;
  background-color: var(--color-border);
  margin: 0 var(--spacing-sm);
`;

const ReservationContentWrapper = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const SeatSelectionSection = styled.section``;

const TimerContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const TimerLabel = styled.span`
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: ${({ isLow }) => isLow ? 'var(--color-error)' : 'var(--color-primary)'};
`;

const ResetButton = styled.button`
  margin-left: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  
  &:hover {
    background-color: var(--color-surface);
  }
`;

const SeatSelectionContainer = styled.div`
  flex: 2;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-md);
`;

const ReservationSummaryContainer = styled.div`
  flex: 1;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-md);
  align-self: flex-start;
  position: sticky;
  top: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
`;

const AudienceSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SeatSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const NextButton = styled(Button)`
  width: 100%;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const PaymentSection = styled.section``;

const PaymentContainer = styled.div`
  flex: 2;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-md);
`;

const TermsSection = styled.div`
  margin-top: var(--spacing-lg);
`;

const TermsAgreement = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  
  input {
    width: 20px;
    height: 20px;
  }
  
  label {
    font-weight: 500;
  }
`;

const TermsContent = styled.div`
  padding: var(--spacing-md);
  background-color: var(--color-background);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const BackButton = styled(Button)`
  flex: 1;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
`;

const CompleteSection = styled.section``;

const CompleteMessage = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  h2 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    color: var(--color-text-secondary);
  }
`;

const CompleteIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  border-radius: 50%;
  background-color: var(--color-success);
  color: white;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CompleteDetailsContainer = styled.div`
  flex: 2;
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-md);
`;

const CompleteDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: var(--color-text-secondary);
`;

const DetailValue = styled.span`
  font-weight: 600;
`;

const HomeButton = styled(Button)`
  flex: 1;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
`;

const MyPageButton = styled(Button)`
  flex: 1;
  background-color: var(--color-primary);
  color: white;
  font-weight: 600;
  padding: var(--spacing-sm) var(--spacing-md);
`;

const ErrorContainer = styled.div`
  max-width: 600px;
  margin: 100px auto;
  text-align: center;
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  box-shadow: var(--box-shadow-md);
  
  h2 {
    margin-bottom: var(--spacing-md);
  }
  
  p {
    margin-bottom: var(--spacing-lg);
    color: var(--color-error);
  }
`;

export default ReservationPage;