import React from 'react';
import styled from 'styled-components';
import MovieSelection from './MovieSelection';
import { useBooking } from '../../context/BookingContext';
import TheaterSelection from './TheaterSelection';
import DateTimeSelection from './DateTimeSelection';
import SeatSelection from './SeatSelection';
import PaymentForm from './PaymentForm';
const BookingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    top: 14px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #e0e0e0;
    z-index: -1;
  }
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  
  .step-number {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: ${props =>
    props.completed ? '#e51937' : props.active ? '#e51937' : '#e0e0e0'};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .step-label {
    font-size: 0.9rem;
    color: ${props => props.active || props.completed ? '#333' : '#999'};
    font-weight: ${props => props.active ? '600' : '400'};
  }
`;

const BookingFlow: React.FC = () => {
  const { state } = useBooking();
  const { currentStep } = state;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <MovieSelection />;
      case 2:
        return <TheaterSelection />;
      case 3:
        return <DateTimeSelection />;
      case 4:
        return <SeatSelection />;
      case 5:
        return <PaymentForm />;
      default:
        return <MovieSelection />;
    }
  };

  return (
    <BookingContainer>
      <StepsContainer>
        <Step active={currentStep === 1} completed={currentStep > 1}>
          <div className="step-number">1</div>
          <div className="step-label">영화 선택</div>
        </Step>
        <Step active={currentStep === 2} completed={currentStep > 2}>
          <div className="step-number">2</div>
          <div className="step-label">극장 선택</div>
        </Step>
        <Step active={currentStep === 3} completed={currentStep > 3}>
          <div className="step-number">3</div>
          <div className="step-label">날짜/시간 선택</div>
        </Step>
        <Step active={currentStep === 4} completed={currentStep > 4}>
          <div className="step-number">4</div>
          <div className="step-label">좌석 선택</div>
        </Step>
        <Step active={currentStep === 5} completed={currentStep > 5}>
          <div className="step-number">5</div>
          <div className="step-label">결제</div>
        </Step>
      </StepsContainer>

      {renderStepContent()}
    </BookingContainer>
  );
};

export default BookingFlow;