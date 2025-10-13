// src/components/common/PageTitle.js
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * 페이지 제목 컴포넌트
 * 
 * @param {Object} props
 * @param {string} props.children - 제목 텍스트 또는 아이콘과 텍스트 조합
 * @param {string} props.subtitle - 부제목 (선택 사항)
 * @param {string} props.align - 정렬 방식 ('left', 'center', 'right')
 */
const PageTitle = ({ children, subtitle, align = 'left' }) => {
    return (
        <TitleContainer align={align}>
            <Title>{children}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
        </TitleContainer>
    );
};

const TitleContainer = styled.div`
  margin-bottom: var(--spacing-xl);
  text-align: ${props => props.align};
`;

const Title = styled.h1`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: ${props => props.align === 'center' ? 'center' : props.align === 'right' ? 'flex-end' : 'flex-start'};
  
  svg {
    margin-right: var(--spacing-sm);
    color: var(--color-primary);
  }
`;

const Subtitle = styled.p`
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
`;

PageTitle.propTypes = {
    children: PropTypes.node.isRequired,
    subtitle: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right'])
};

export default PageTitle;