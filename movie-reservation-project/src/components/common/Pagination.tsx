import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  width: 40px;
  height: 40px;
  margin: 0 5px;
  border-radius: 50%;
  border: 1px solid ${props => props.isActive ? '#e51937' : '#ddd'};
  background-color: ${props => props.isActive ? '#e51937' : 'white'};
  color: ${props => props.isActive ? 'white' : '#333'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isActive ? '#c41730' : '#f5f5f5'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const NavigationButton = styled(PageButton)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

type PageItem = number | string;

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1
}) => {
  // 페이지 버튼 범위 계산
  const getPageRange = (): PageItem[] => {
    const totalNumbers = siblingCount * 2 + 3; // 양쪽 형제 페이지 + 현재 페이지 + 처음과 마지막
    const totalBlocks = totalNumbers + 2; // +2는 '...' 표시를 위한 공간

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange: PageItem[] = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange: PageItem[] = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange: PageItem[] = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, '...', ...middleRange, '...', totalPages];
    }

    return [];
  };

  const pageRange = getPageRange();

  return (
    <PaginationContainer>
      <NavigationButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </NavigationButton>

      {pageRange.map((page, index) => {
        if (page === '...') {
          return (
            <PageButton key={`ellipsis-${index}`} disabled>
              ...
            </PageButton>
          );
        }

        return (
          <PageButton
            key={page}
            isActive={page === currentPage}
            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
          >
            {page}
          </PageButton>
        );
      })}

      <NavigationButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </NavigationButton>
    </PaginationContainer>
  );
};

export default Pagination;