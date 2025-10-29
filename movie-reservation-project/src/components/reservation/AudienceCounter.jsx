// src/components/reservation/AudienceCounter.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';

/**
 * 관람객 수 선택 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.audienceCount - 관람객 수 객체 (adult, teen, child, senior)
 * @param {Function} props.onAudienceChange - 관람객 수 변경 시 호출될 함수
 * @param {number} props.maxTotal - 최대 선택 가능한 총 관람객 수
 */
const AudienceCounter = ({ audienceCount, onAudienceChange, maxTotal = 8 }) => {
    // 현재 선택된 총 관람객 수
    const totalCount = Object.values(audienceCount).reduce((sum, count) => sum + count, 0);

    console.log('[AudienceCounter] onAudienceChange prop 값:', onAudienceChange);
    console.log('[AudienceCounter] onAudienceChange prop 타입:', typeof onAudienceChange);
    // 관람객 수 증가 핸들러
    const handleIncrement = (type) => {
        // 최대 인원 체크
        if (totalCount >= maxTotal) return;

        const newCount = {
            ...audienceCount,
            [type]: (audienceCount[type] || 0) + 1
        };

        // onAudienceChange(newCount);
        if (typeof onAudienceChange === 'function') {
            onAudienceChange(newCount); // ✨ 이 부분이 29번째 줄일 가능성이 높습니다.
        } else {
            console.error(
                "오류: onAudienceChange prop이 함수가 아닙니다! 상위 컴포넌트를 확인하세요.",
                onAudienceChange
            );
            // 함수가 아닐 경우 여기서 return 하거나 다른 오류 처리 로직을 넣을 수 있습니다.
        }
    };

    // 관람객 수 감소 핸들러
    const handleDecrement = (type) => {
        if (!audienceCount[type] || audienceCount[type] <= 0) return;

        const newCount = {
            ...audienceCount,
            [type]: audienceCount[type] - 1
        };

        onAudienceChange(newCount);
    };

    return (
        <CounterContainer>
            <TotalInfo>
                <TotalLabel>총 인원</TotalLabel>
                <TotalCount>{totalCount}명</TotalCount>
                <MaxInfo>최대 {maxTotal}명까지 선택 가능</MaxInfo>
            </TotalInfo>

            <CounterList>
                <CounterItem>
                    <CounterLabel>성인</CounterLabel>
                    <CounterControl>
                        <CounterButton
                            onClick={() => handleDecrement('adult')}
                            disabled={!audienceCount.adult || audienceCount.adult <= 0}
                        >
                            <FaMinus />
                        </CounterButton>
                        <CounterValue>{audienceCount.adult || 0}</CounterValue>
                        <CounterButton
                            onClick={() => handleIncrement('adult')}
                            disabled={totalCount >= maxTotal}
                        >
                            <FaPlus />
                        </CounterButton>
                    </CounterControl>
                </CounterItem>

                <CounterItem>
                    <CounterLabel>청소년</CounterLabel>
                    <CounterControl>
                        <CounterButton
                            onClick={() => handleDecrement('teen')}
                            disabled={!audienceCount.teen || audienceCount.teen <= 0}
                        >
                            <FaMinus />
                        </CounterButton>
                        <CounterValue>{audienceCount.teen || 0}</CounterValue>
                        <CounterButton
                            onClick={() => handleIncrement('teen')}
                            disabled={totalCount >= maxTotal}
                        >
                            <FaPlus />
                        </CounterButton>
                    </CounterControl>
                </CounterItem>

                <CounterItem>
                    <CounterLabel>어린이</CounterLabel>
                    <CounterControl>
                        <CounterButton
                            onClick={() => handleDecrement('child')}
                            disabled={!audienceCount.child || audienceCount.child <= 0}
                        >
                            <FaMinus />
                        </CounterButton>
                        <CounterValue>{audienceCount.child || 0}</CounterValue>
                        <CounterButton
                            onClick={() => handleIncrement('child')}
                            disabled={totalCount >= maxTotal}
                        >
                            <FaPlus />
                        </CounterButton>
                    </CounterControl>
                </CounterItem>

                <CounterItem>
                    <CounterLabel>경로</CounterLabel>
                    <CounterControl>
                        <CounterButton
                            onClick={() => handleDecrement('senior')}
                            disabled={!audienceCount.senior || audienceCount.senior <= 0}
                        >
                            <FaMinus />
                        </CounterButton>
                        <CounterValue>{audienceCount.senior || 0}</CounterValue>
                        <CounterButton
                            onClick={() => handleIncrement('senior')}
                            disabled={totalCount >= maxTotal}
                        >
                            <FaPlus />
                        </CounterButton>
                    </CounterControl>
                </CounterItem>
            </CounterList>

            {totalCount === 0 && (
                <EmptyMessage>관람객 수를 선택해주세요</EmptyMessage>
            )}
        </CounterContainer>
    );
};

// 스타일 컴포넌트
const CounterContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--box-shadow-sm);
`;

const TotalInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
`;

const TotalLabel = styled.div`
  font-weight: 600;
  margin-right: var(--spacing-sm);
`;

const TotalCount = styled.div`
  font-weight: 700;
  color: var(--color-primary);
  margin-right: var(--spacing-md);
`;

const MaxInfo = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const CounterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const CounterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) 0;
`;

const CounterLabel = styled.div`
  font-weight: 500;
`;

const CounterControl = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const CounterButton = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid ${props => props.disabled ? 'var(--color-text-disabled)' : 'var(--color-border)'};
  background-color: ${props => props.disabled ? 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))' : 'var(--color-surface)'};
  color: ${props => props.disabled ? 'var(--color-text-disabled)' : 'var(--color-text-primary)'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
`;

const CounterValue = styled.div`
  min-width: 24px;
  text-align: center;
  font-weight: 600;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-md);
`;

AudienceCounter.propTypes = {
    audienceCount: PropTypes.shape({
        adult: PropTypes.number,
        teen: PropTypes.number,
        child: PropTypes.number,
        senior: PropTypes.number
    }).isRequired,
    onAudienceChange: PropTypes.func.isRequired,
    maxTotal: PropTypes.number
};

export default AudienceCounter;