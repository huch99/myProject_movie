// src/pages/CouponsPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { fetchUserCoupons } from '../store/slices/userSlice';
import Container from '../components/layout/Container';
import PageTitle from '../components/common/PageTitle';
import CouponList from '../components/user/CouponList';
import EmptyState from '../components/common/EmptyState';
import Loading from '../components/common/Loading';
import { FaGift, FaFilter } from 'react-icons/fa';

/**
 * 쿠폰함 페이지 컴포넌트
 */
const CouponsPage = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error } = useSelector(state => state.user);
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'expired'
  
  // 쿠폰 목록 불러오기
  useEffect(() => {
    dispatch(fetchUserCoupons());
  }, [dispatch]);
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FaGift />
          <span>쿠폰함</span>
        </PageTitle>
        
        <FilterContainer>
          <FilterLabel>
            <FaFilter />
            <span>필터:</span>
          </FilterLabel>
          <FilterTabs>
            <FilterTab 
              active={filter === 'all'} 
              onClick={() => handleFilterChange('all')}
            >
              전체
            </FilterTab>
            <FilterTab 
              active={filter === 'available'} 
              onClick={() => handleFilterChange('available')}
            >
              사용 가능
            </FilterTab>
            <FilterTab 
              active={filter === 'expired'} 
              onClick={() => handleFilterChange('expired')}
            >
              만료/사용됨
            </FilterTab>
          </FilterTabs>
        </FilterContainer>
      </PageHeader>
      
      {loading ? (
        <Loading text="쿠폰 정보를 불러오는 중입니다..." />
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : coupons?.length > 0 ? (
        <CouponList 
          filter={filter}
          totalAmount={0} // 결제 페이지가 아니므로 0으로 설정
        />
      ) : (
        <EmptyState
          icon={<FaGift size={48} />}
          title="보유한 쿠폰이 없습니다"
          description="영화 예매 시 할인 혜택을 받을 수 있는 쿠폰을 모아보세요!"
          action={
            <ActionInfo>
              쿠폰은 이벤트 참여나 프로모션을 통해 획득할 수 있습니다.
            </ActionInfo>
          }
        />
      )}
      
      <CouponInfoSection>
        <InfoTitle>쿠폰 이용 안내</InfoTitle>
        <InfoList>
          <InfoItem>쿠폰은 명시된 유효기간 내에만 사용 가능합니다.</InfoItem>
          <InfoItem>쿠폰마다 최소 주문금액이 설정되어 있을 수 있습니다.</InfoItem>
          <InfoItem>일부 쿠폰은 특정 영화나 극장에서만 사용 가능합니다.</InfoItem>
          <InfoItem>사용한 쿠폰은 재사용이 불가능합니다.</InfoItem>
          <InfoItem>쿠폰 관련 문의는 고객센터로 연락해 주세요.</InfoItem>
        </InfoList>
      </CouponInfoSection>
    </Container>
  );
};

// 스타일 컴포넌트
const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const FilterTabs = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const FilterTab = styled.button`
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: ${props => props.active 
    ? 'var(--color-primary)' 
    : 'var(--color-surface)'};
  color: ${props => props.active 
    ? 'white' 
    : 'var(--color-text-primary)'};
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  font-size: var(--font-size-sm);
  
  &:hover {
    background-color: ${props => props.active 
      ? 'var(--color-primary)' 
      : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--color-error);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-error);
`;

const ActionInfo = styled.div`
  text-align: center;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const CouponInfoSection = styled.div`
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
`;

const InfoTitle = styled.h3`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
`;

const InfoList = styled.ul`
  padding-left: var(--spacing-lg);
`;

const InfoItem = styled.li`
  margin-bottom: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

export default CouponsPage;