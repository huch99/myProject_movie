// src/components/common/EmptyState.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaInbox } from 'react-icons/fa'; // 기본 아이콘

/**
 * 내용이 비어있을 때 표시되는 상태 컴포넌트
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.icon - 표시할 아이콘 컴포넌트 (선택 사항)
 * @param {string} props.title - 비어있을 때 표시할 제목 (필수)
 * @param {string} props.description - 비어있을 때 표시할 설명 (선택 사항)
 * @param {React.ReactNode} props.action - 사용자에게 보여줄 액션 (예: 버튼, 링크 등) (선택 사항)
 */
const EmptyState = ({ icon, title, description, action }) => {
    return (
        <EmptyStateContainer>
            <IconWrapper>
                {icon || <FaInbox size={48} />} {/* 아이콘이 없으면 기본 아이콘 사용 */}
            </IconWrapper>
            <Title>{title}</Title>
            {description && <Description>{description}</Description>}
            {action && <ActionWrapper>{action}</ActionWrapper>}
        </EmptyStateContainer>
    );
};

// 스타일 컴포넌트
const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  text-align: center;
  background-color: var(--color-surface, #fff);
  border-radius: var(--border-radius-lg, 8px);
  color: var(--color-text-secondary, #666);
  box-shadow: var(--box-shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
`;

const IconWrapper = styled.div`
  margin-bottom: var(--spacing-lg, 1.5rem);
  color: var(--color-primary, #e51937); /* 주요 색상 사용 */
  opacity: 0.8;
  
  svg {
    width: auto; /* SVG 크기 자동 조절 */
    height: 48px; /* 기본 높이 */
  }
`;

const Title = styled.h3`
  font-size: var(--font-size-xl, 1.25rem);
  font-weight: 700;
  margin-bottom: var(--spacing-md, 1rem);
  color: var(--color-text-primary, #333);
`;

const Description = styled.p`
  font-size: var(--font-size-md, 1rem);
  margin-bottom: var(--spacing-lg, 1.5rem);
  line-height: 1.5;
`;

const ActionWrapper = styled.div`
  margin-top: var(--spacing-md, 1rem);
`;

EmptyState.propTypes = {
    icon: PropTypes.node,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    action: PropTypes.node
};

export default EmptyState;