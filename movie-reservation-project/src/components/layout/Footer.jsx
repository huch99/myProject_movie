import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import ROUTE_PATHS from '../../constants/routePaths';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <FooterContainer>
            <FooterContent>
                <FooterTop>
                    <FooterLogo to={ROUTE_PATHS.HOME}>
                        MOVIE<span>BOOKING</span>
                    </FooterLogo>

                    <FooterNav>
                        <FooterNavSection>
                            <FooterNavTitle>회사 소개</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem to="/about">회사 소개</FooterNavItem>
                                <FooterNavItem to="/investor">투자 정보</FooterNavItem>
                                <FooterNavItem to="/careers">채용 정보</FooterNavItem>
                                <FooterNavItem to="/contact">고객센터</FooterNavItem>
                            </FooterNavList>
                        </FooterNavSection>

                        <FooterNavSection>
                            <FooterNavTitle>이용 안내</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem to="/guide">예매 안내</FooterNavItem>
                                <FooterNavItem to="/membership">멤버십</FooterNavItem>
                                <FooterNavItem to="/discount">할인 혜택</FooterNavItem>
                                <FooterNavItem to="/gift-card">상품권</FooterNavItem>
                            </FooterNavList>
                        </FooterNavSection>

                        <FooterNavSection>
                            <FooterNavTitle>고객 지원</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem to="/faq">자주 묻는 질문</FooterNavItem>
                                <FooterNavItem to="/notice">공지사항</FooterNavItem>
                                <FooterNavItem to="/lost">분실물 문의</FooterNavItem>
                                <FooterNavItem to="/inquiry">1:1 문의</FooterNavItem>
                            </FooterNavList>
                        </FooterNavSection>

                        <FooterNavSection>
                            <FooterNavTitle>법적 고지</FooterNavTitle>
                            <FooterNavList>
                                <FooterNavItem to="/terms">이용약관</FooterNavItem>
                                <FooterNavItem to="/privacy">개인정보처리방침</FooterNavItem>
                                <FooterNavItem to="/youth">청소년 보호정책</FooterNavItem>
                                <FooterNavItem to="/email">이메일 무단수집거부</FooterNavItem>
                            </FooterNavList>
                        </FooterNavSection>
                    </FooterNav>
                </FooterTop>

                <Divider />

                <FooterBottom>
                    <CompanyInfo>
                        <p>
                            <strong>(주)무비부킹</strong> | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890
                        </p>
                        <p>
                            주소: 서울특별시 강남구 테헤란로 123 무비부킹타워 | 통신판매업신고: 제2025-서울강남-1234호
                        </p>
                        <p>
                            고객센터: 1544-0000 (평일 09:00~18:00, 주말 및 공휴일 휴무)
                        </p>
                        <p>
                            &copy; {currentYear} MOVIEBOOKING. All Rights Reserved.
                        </p>
                    </CompanyInfo>

                    <SocialLinks>
                        <SocialLink href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF />
                        </SocialLink>
                        <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FaTwitter />
                        </SocialLink>
                        <SocialLink href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram />
                        </SocialLink>
                        <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <FaYoutube />
                        </SocialLink>
                    </SocialLinks>
                </FooterBottom>
            </FooterContent>
        </FooterContainer>
    );
};

// 스타일 컴포넌트
const FooterContainer = styled.footer`
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-3xl);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

const FooterTop = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FooterLogo = styled(Link)`
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
  
  span {
    font-size: var(--font-size-md);
    font-weight: 500;
    color: var(--color-text-secondary);
  }
`;

const FooterNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xl);
  
  @media (max-width: 1024px) {
    width: 100%;
    justify-content: space-between;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
`;

const FooterNavSection = styled.div`
  min-width: 150px;
  
  @media (max-width: 1024px) {
    min-width: 120px;
  }
`;

const FooterNavTitle = styled.h4`
  font-size: var(--font-size-md);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
`;

const FooterNavList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const FooterNavItem = styled(Link)`
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: var(--transition-fast);
  
  &:hover {
    color: var(--color-primary);
  }
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-lg) 0;
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CompanyInfo = styled.div`
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  line-height: 1.6;
  
  p {
    margin-bottom: var(--spacing-xs);
  }
  
  strong {
    font-weight: 600;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-full);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  transition: var(--transition-fast);
  
  &:hover {
    background-color: var(--color-primary);
    color: white;
  }
`;

export default Footer;