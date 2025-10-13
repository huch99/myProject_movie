// src/components/user/UserInfo.js
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaUser, FaEnvelope, FaCalendarAlt, FaClock, FaMedal } from 'react-icons/fa';
import dateUtils from '../../utils/dateUtils';

/**
 * 사용자 정보 표시 컴포넌트
 * 
 * @param {Object} props
 * @param {Object} props.user - 사용자 정보 객체
 * @param {boolean} props.compact - 간략한 정보만 표시할지 여부
 */
const UserInfo = ({ user, compact = false }) => {
    if (!user) return null;

    // 사용자 가입 기간 계산
    const calculateMembershipDuration = (joinDate) => {
        if (!joinDate) return '정보 없음';

        const join = new Date(joinDate);
        const now = new Date();
        const diffYears = now.getFullYear() - join.getFullYear();
        const diffMonths = now.getMonth() - join.getMonth();

        let years = diffYears;
        let months = diffMonths;

        if (diffMonths < 0) {
            years -= 1;
            months += 12;
        }

        if (years > 0) {
            return `${years}년 ${months}개월`;
        } else {
            return `${months}개월`;
        }
    };

    // 사용자 등급에 따른 색상 반환
    const getMembershipColor = (tier) => {
        switch (tier) {
            case 'PREMIUM':
                return 'var(--color-premium, #e5c07b)';
            case 'VIP':
                return 'var(--color-vip, #c678dd)';
            case 'VVIP':
                return 'var(--color-vvip, #e06c75)';
            default:
                return 'var(--color-regular, #56b6c2)';
        }
    };

    // 간략한 정보만 표시
    if (compact) {
        return (
            <CompactInfoContainer>
                <UserName>{user.nickname || user.username}</UserName>
                <UserEmail>{user.email}</UserEmail>
                <MembershipBadge color={getMembershipColor(user.tier)}>
                    {user.tier || '일반'} 회원
                </MembershipBadge>
            </CompactInfoContainer>
        );
    }

    // 상세 정보 표시
    return (
        <InfoContainer>
            <InfoHeader>
                <HeaderTitle>회원 정보</HeaderTitle>
                {user.tier && (
                    <MembershipBadge color={getMembershipColor(user.tier)}>
                        {user.tier} 회원
                    </MembershipBadge>
                )}
            </InfoHeader>

            <InfoList>
                <InfoItem>
                    <InfoIcon>
                        <FaUser />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>이름</InfoLabel>
                        <InfoValue>{user.username || '정보 없음'}</InfoValue>
                    </InfoContent>
                </InfoItem>

                <InfoItem>
                    <InfoIcon>
                        <FaUser />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>닉네임</InfoLabel>
                        <InfoValue>{user.nickname || '정보 없음'}</InfoValue>
                    </InfoContent>
                </InfoItem>

                <InfoItem>
                    <InfoIcon>
                        <FaEnvelope />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>이메일</InfoLabel>
                        <InfoValue>{user.email || '정보 없음'}</InfoValue>
                    </InfoContent>
                </InfoItem>

                <InfoItem>
                    <InfoIcon>
                        <FaCalendarAlt />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>생년월일</InfoLabel>
                        <InfoValue>
                            {user.birthDate ? dateUtils.formatDate(user.birthDate) : '정보 없음'}
                        </InfoValue>
                    </InfoContent>
                </InfoItem>

                <InfoItem>
                    <InfoIcon>
                        <FaCalendarAlt />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>가입일</InfoLabel>
                        <InfoValue>
                            {user.joinDate ? dateUtils.formatDate(user.joinDate) : '정보 없음'}
                            {user.joinDate && (
                                <MembershipDuration>
                                    (가입기간: {calculateMembershipDuration(user.joinDate)})
                                </MembershipDuration>
                            )}
                        </InfoValue>
                    </InfoContent>
                </InfoItem>

                <InfoItem>
                    <InfoIcon>
                        <FaClock />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>최근 로그인</InfoLabel>
                        <InfoValue>
                            {user.lastLoginAt ? dateUtils.formatDateTime(user.lastLoginAt) : '정보 없음'}
                        </InfoValue>
                    </InfoContent>
                </InfoItem>

                <InfoItem>
                    <InfoIcon>
                        <FaMedal />
                    </InfoIcon>
                    <InfoContent>
                        <InfoLabel>활동 포인트</InfoLabel>
                        <InfoValue>{user.points?.toLocaleString() || 0} 포인트</InfoValue>
                    </InfoContent>
                </InfoItem>
            </InfoList>
        </InfoContainer>
    );
};

// 스타일 컴포넌트
const InfoContainer = styled.div`
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-sm);
`;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
`;

const HeaderTitle = styled.h3`
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
`;

const MembershipBadge = styled.div`
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: white;
  background-color: ${props => props.color || 'var(--color-primary)'};
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
`;

const InfoIcon = styled.div`
  margin-right: var(--spacing-md);
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  width: 24px;
  display: flex;
  justify-content: center;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const InfoValue = styled.div`
  color: var(--color-text-primary);
  font-weight: 500;
`;

const MembershipDuration = styled.span`
  margin-left: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-weight: normal;
`;

// 간략 정보 스타일
const CompactInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-md);
`;

const UserName = styled.div`
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
`;

const UserEmail = styled.div`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
`;

UserInfo.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
        nickname: PropTypes.string,
        email: PropTypes.string,
        birthDate: PropTypes.string,
        joinDate: PropTypes.string,
        lastLoginAt: PropTypes.string,
        tier: PropTypes.string,
        points: PropTypes.number
    }),
    compact: PropTypes.bool
};

export default UserInfo;