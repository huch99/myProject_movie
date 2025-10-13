// src/components/layout/Container.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * 컨텐츠를 담는 컨테이너 컴포넌트
 * 페이지 내용을 적절한 너비로 중앙 정렬해주는 역할
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - 컨테이너 내부에 표시될 컨텐츠
 * @param {boolean} props.fluid - 전체 너비 사용 여부 (기본값: false)
 * @param {string} props.className - 추가 CSS 클래스
 */
const Container = ({ children, fluid, className }) => {
  return (
    <ContainerWrapper fluid={fluid ? "true" : undefined} className={className}>
      {children}
    </ContainerWrapper>
  );
};

const ContainerWrapper = styled.div`
  width: 100%;
  max-width: ${props => props.fluid ? '100%' : 'var(--container-max-width, 1200px)'};
  margin: 0 auto;
  padding: 0 var(--spacing-lg, 1.5rem);
  
  @media (max-width: 768px) {
    padding: 0 var(--spacing-md, 1rem);
  }
`;

Container.propTypes = {
  children: PropTypes.node.isRequired,
  fluid: PropTypes.bool,
  className: PropTypes.string
};

export default Container;