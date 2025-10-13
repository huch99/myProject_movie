// src/components/user/UserProfileCard.jsx
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaUser, FaEdit, FaTicketAlt, FaGift } from 'react-icons/fa';
import ROUTE_PATHS from '../../constants/routePaths';

/**
 * 사용자 프로필 카드 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.user - 사용자 정보 객체
 * @param {boolean} props.loading - 로딩 상태
 * @param {boolean} props.compact - 간소화된 카드 표시 여부
 */
const UserProfileCard = ({ user, loading = false, compact = false }) => {
    // 로딩 중 표시
    if (loading) {
        return (
            <CardContainer>
                <LoadingProfile>
                    <LoadingAvatar />
                    <LoadingText />
                    <LoadingText width="60%" />
                </LoadingProfile>
            </CardContainer>
        );
    }

    // 사용자 정보가 없는 경우
    if (!user) {
        return (
            <CardContainer>
                <EmptyProfile>
                    <FaUser size={48} />
                    <EmptyText>로그인이 필요합니다</EmptyText>
                </EmptyProfile>
            </CardContainer>
        );
    }

    // 간소화된 카드 렌더링
    if (compact) {
        return (
            <CompactCardContainer>
                <ProfileHeader>
                    <CompactAvatar src={user.profileImage || '/images/default-profile.jpg'} alt="프로필 이미지" />
                    <ProfileInfo>
                        <ProfileName>{user.nickname || user.username}</ProfileName>
                        <ProfileEmail>{user.email}</ProfileEmail>
                    </ProfileInfo>
                </ProfileHeader>
            </CompactCardContainer>
        );
    }

    // 기본 카드 렌더링
    return (
        <CardContainer>
            <ProfileHeader>
                <AvatarContainer>
                    <Avatar src={user.profileImage || '/images/default-profile.jpg'} alt="프로필 이미지" />
                    <MembershipBadge>
                        {user.tier || '일반'} 회원
                    </MembershipBadge>
                </AvatarContainer>

                <ProfileInfo>
                    <ProfileName>{user.nickname || user.username}</ProfileName>
                    <ProfileEmail>{user.email}</ProfileEmail>

                    <ProfileStats>
                        <StatItem>
                            <StatLabel>포인트</StatLabel>
                            <StatValue>{user.points?.toLocaleString() || 0}P</StatValue>
                        </StatItem>

                        <StatDivider />

                        <StatItem>
                            <StatLabel>쿠폰</StatLabel>
                            <StatValue>{user.coupons?.length || 0}장</StatValue>
                        </StatItem>
                    </ProfileStats>
                </ProfileInfo>
            </ProfileHeader>

            <ProfileActions>
                <ActionButton to={ROUTE_PATHS.PROFILE_EDIT}>
                    <FaEdit />
                    <span>정보 수정</span>
                </ActionButton>

                <ActionButton to={ROUTE_PATHS.RESERVATION_HISTORY}>
                    <FaTicketAlt />
                    <span>예매 내역</span>
                </ActionButton>

                <ActionButton to={ROUTE_PATHS.COUPONS}>
                    <FaGift />
                    <span>쿠폰함</span>
                </ActionButton>
            </ProfileActions>
        </CardContainer>
    );
};

// 스타일 컴포넌트
const CardContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-sm);
  overflow: hidden;
  padding: var(--spacing-md);
`;

const CompactCardContainer = styled(CardContainer)`
  padding: var(--spacing-sm);
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const AvatarContainer = styled.div`
  position: relative;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
`;

const CompactAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary);
`;

const MembershipBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--color-primary);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px var(--spacing-xs);
  border-radius: var(--border-radius-full);
  transform: translateY(50%);
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const ProfileEmail = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
`;

const ProfileStats = styled.div`
  display: flex;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.div`
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
`;

const StatValue = styled.div`
  font-weight: 600;
  color: var(--color-primary);
`;

const StatDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: var(--color-border);
  margin: 0 var(--spacing-md);
`;

const ProfileActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
`;

const ActionButton = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  
  svg {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
    color: var(--color-primary);
  }
  
  &:hover {
    color: var(--color-primary);
  }
`;

const LoadingProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
  gap: var(--spacing-md);
`;

const LoadingAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.05));
  animation: pulse 1.5s infinite ease-in-out;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }
`;

const LoadingText = styled.div`
  height: 16px;
  width: ${props => props.width || '80%'};
  background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.05));
  border-radius: var(--border-radius-sm);
  animation: pulse 1.5s infinite ease-in-out;
`;

const EmptyProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
`;

const EmptyText = styled.div`
  margin-top: var(--spacing-md);
  font-size: var(--font-size-md);
`;

UserProfileCard.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
        nickname: PropTypes.string,
        email: PropTypes.string,
        profileImage: PropTypes.string,
        tier: PropTypes.string,
        points: PropTypes.number,
        coupons: PropTypes.array
    }),
    loading: PropTypes.bool,
    compact: PropTypes.bool
};

export default UserProfileCard;