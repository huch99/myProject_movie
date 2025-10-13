import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

/**
 * 재사용 가능한 페이지네이션 컴포넌트
 * 
 * @param {Object} props
 * @param {number} props.currentPage - 현재 페이지 번호 (0부터 시작)
 * @param {number} props.totalPages - 전체 페이지 수
 * @param {function} props.onPageChange - 페이지 변경 이벤트 핸들러
 * @param {number} props.siblingCount - 현재 페이지 양쪽에 표시할 페이지 수
 * @param {string} props.size - 페이지네이션 크기 (small, medium, large)
 * @param {boolean} props.showFirstLast - 처음/마지막 페이지 버튼 표시 여부
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  size = 'medium',
  showFirstLast = false,
}) => {
  // 페이지 번호가 0부터 시작하는 경우를 대비해 표시용 페이지 번호 계산
  const displayPage = currentPage + 1;
  
  // 페이지 범위 생성 함수
  const generatePageRange = () => {
    // 표시할 페이지 버튼의 범위 계산
    let startPage = Math.max(1, displayPage - siblingCount);
    let endPage = Math.min(totalPages, displayPage + siblingCount);
    
    // startPage와 endPage 사이의 간격이 siblingCount*2보다 작으면 조정
    const rangeSize = siblingCount * 2 + 1;
    if (endPage - startPage + 1 < rangeSize) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + rangeSize - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - rangeSize + 1);
      }
    }
    
    // 페이지 번호 배열 생성
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const pageRange = generatePageRange();
  
  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };
  
  if (totalPages <= 1) {
    return null; // 페이지가 1개 이하면 페이지네이션 표시 안함
  }
  
  return (
    <PaginationContainer size={size}>
      {/* 처음 페이지로 이동 버튼 */}
      {showFirstLast && (
        <PageButton
          onClick={() => handlePageChange(0)}
          disabled={currentPage === 0}
        >
          처음
        </PageButton>
      )}
      
      {/* 이전 페이지로 이동 버튼 */}
      <PageButton
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <FaAngleLeft />
      </PageButton>
      
      {/* 페이지 번호 버튼들 */}
      {pageRange.map((page) => (
        <PageButton
          key={page}
          active={page === displayPage}
          onClick={() => handlePageChange(page - 1)}
        >
          {page}
        </PageButton>
      ))}
      
      {/* 다음 페이지로 이동 버튼 */}
      <PageButton
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        <FaAngleRight />
      </PageButton>
      
      {/* 마지막 페이지로 이동 버튼 */}
      {showFirstLast && (
        <PageButton
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={currentPage === totalPages - 1}
        >
          마지막
        </PageButton>
      )}
    </PaginationContainer>
  );
};


// 스타일 컴포넌트
const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs, 4px);
  margin: var(--spacing-lg, 24px) 0;
  
  ${({ size }) => sizeStyles[size] || sizeStyles.medium}
`;

const PageButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border-radius: var(--border-radius-sm, 4px);
  border: 1px solid ${({ active }) => 
    active ? 'var(--color-primary)' : 'var(--color-border)'};
  background-color: ${({ active }) => 
    active ? 'var(--color-primary)' : 'var(--color-background)'};
  color: ${({ active }) => 
    active ? 'white' : 'var(--color-text-primary)'};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  cursor: pointer;
  transition: var(--transition-fast, all 0.15s ease);
  
  &:hover:not(:disabled) {
    background-color: ${({ active }) => 
      active ? 'var(--color-primary)' : 'var(--color-surface)'};
    border-color: ${({ active }) => 
      active ? 'var(--color-primary)' : 'var(--color-primary)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// 페이지네이션 크기 스타일
const sizeStyles = {
  small: css`
    font-size: var(--font-size-xs, 0.75rem);
    
    ${PageButton} {
      width: 28px;
      height: 28px;
    }
  `,
  medium: css`
    font-size: var(--font-size-sm, 0.875rem);
    
    ${PageButton} {
      width: 36px;
      height: 36px;
    }
  `,
  large: css`
    font-size: var(--font-size-md, 1rem);
    
    ${PageButton} {
      width: 44px;
      height: 44px;
    }
  `,
};


Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  showFirstLast: PropTypes.bool,
};

export default Pagination;