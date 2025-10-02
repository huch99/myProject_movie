import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const FooterContainer = styled.footer`
    background-color: #1a1a1a;
    color: #9e9e9e;
    padding: 40px 0;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TopSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const FooterLogo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  
  img {
    height: 30px;
    margin-right: 10px;
  }
`;

const Column = styled.div`
  flex: 1;
  min-width: 160px;
  margin-right: 20px;
  
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const ColumnTitle = styled.h4`
  color: white;
  margin-bottom: 15px;
  font-size: 1rem;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #9e9e9e;
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  
  &:hover {
    color: white;
  }
`;

const ExternalLink = styled.a`
  display: block;
  color: #9e9e9e;
  margin-bottom: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  
  &:hover {
    color: white;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 15px;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #333;
  color: white;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e51937;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #333;
  margin: 20px 0;
`;

const BottomSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 0.8rem;
`;

const LegalLinks = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const LegalLink = styled(Link)`
  color: #9e9e9e;
  font-size: 0.8rem;
  text-decoration: none;
  
  &:hover {
    color: white;
  }
`;

const Footer: React.FC = () => {
    return (
        <FooterContainer>
            <FooterContent>
                <TopSection>
                    <Column>
                        <FooterLogo to="/">
                            <img src="/assets/images/logo-white.png" alt="Movie Booking" />
                            MovieFlix
                        </FooterLogo>
                        <p>최고의 영화 예매 서비스를 제공합니다. 편리한 예매 시스템과 다양한 혜택을 경험해 보세요.</p>
                        <SocialLinks>
                            <SocialIcon href='https://facebook.com' target='_blank' rel='noopenernoreferrer'>
                                <svg width="16" height="16" viewBox='0 0 24 24' fill='currentColor'>
                                    <path d='M13.397,20.997v-8.196h2.765l0.411-3.209h-3.176V7.548c0-0.926,0.258-1.56,1.587-1.56h1.684V3.127
                    C15.849,3.039,15.025,2.997,14.201,3c-2.444,0-4.122,1.492-4.122,4.231v2.355H7.332v3.209h2.753v8.202H13.397z'/>
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.633,7.997c0.013,0.175,0.013,0.349,0.013,0.523c0,5.325-4.053,11.461-11.46,11.461c-2.282,0-4.402-0.661-6.186-1.809
                    c0.324,0.037,0.636,0.05,0.973,0.05c1.883,0,3.616-0.636,5.001-1.721c-1.771-0.037-3.255-1.197-3.767-2.793
                    c0.249,0.037,0.499,0.062,0.761,0.062c0.361,0,0.724-0.05,1.061-0.137c-1.847-0.374-3.23-1.995-3.23-3.953v-0.05
                    c0.537,0.299,1.16,0.486,1.82,0.511C3.534,9.419,2.823,8.184,2.823,6.787c0-0.748,0.199-1.434,0.548-2.032
                    c1.983,2.443,4.964,4.04,8.306,4.215c-0.062-0.3-0.1-0.611-0.1-0.923c0-2.22,1.796-4.028,4.028-4.028
                    c1.16,0,2.207,0.486,2.943,1.272c0.91-0.175,1.782-0.512,2.556-0.973c-0.299,0.935-0.936,1.721-1.771,2.22
                    c0.811-0.088,1.596-0.312,2.319-0.624C21.104,6.712,20.419,7.423,19.633,7.997z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.999,7.377c-2.554,0-4.623,2.07-4.623,4.623c0,2.554,2.069,4.624,4.623,4.624c2.552,0,4.623-2.07,4.623-4.624
                    C16.622,9.447,14.551,7.377,11.999,7.377L11.999,7.377z M11.999,15.004c-1.659,0-3.004-1.345-3.004-3.003
                    c0-1.659,1.345-3.003,3.004-3.003s3.002,1.344,3.002,3.003C15.001,13.659,13.658,15.004,11.999,15.004L11.999,15.004z" />
                                    <circle cx="16.806" cy="7.207" r="1.078" />
                                    <path d="M20.533,6.111c-0.469-1.209-1.424-2.165-2.633-2.632c-0.699-0.263-1.438-0.404-2.186-0.42
                    c-0.963-0.042-1.268-0.054-3.71-0.054s-2.755,0-3.71,0.054C7.548,3.074,6.809,3.215,6.11,3.479C4.9,3.946,3.945,4.902,3.477,6.111
                    c-0.263,0.7-0.404,1.438-0.419,2.186c-0.043,0.962-0.056,1.267-0.056,3.71c0,2.442,0,2.753,0.056,3.71
                    c0.015,0.748,0.156,1.486,0.419,2.187c0.469,1.208,1.424,2.164,2.634,2.632c0.696,0.272,1.435,0.426,2.185,0.45
                    c0.963,0.042,1.268,0.055,3.71,0.055s2.755,0,3.71-0.055c0.747-0.015,1.486-0.157,2.186-0.419c1.209-0.469,2.164-1.424,2.633-2.633
                    c0.263-0.7,0.404-1.438,0.419-2.186c0.043-0.962,0.056-1.267,0.056-3.71s0-2.753-0.056-3.71C20.941,7.57,20.801,6.819,20.533,6.111z
                    M19.315,15.643c-0.007,0.576-0.111,1.147-0.311,1.688c-0.305,0.787-0.926,1.409-1.712,1.711c-0.535,0.199-1.099,0.303-1.67,0.311
                    c-0.95,0.044-1.218,0.055-3.654,0.055c-2.438,0-2.687,0-3.655-0.055c-0.569-0.007-1.135-0.112-1.669-0.311
                    c-0.789-0.301-1.414-0.923-1.719-1.711c-0.196-0.534-0.302-1.099-0.311-1.669c-0.043-0.95-0.053-1.218-0.053-3.654
                    c0-2.437,0-2.686,0.053-3.655c0.007-0.576,0.111-1.146,0.311-1.687c0.305-0.789,0.93-1.41,1.719-1.712
                    c0.534-0.198,1.1-0.303,1.669-0.311c0.95-0.043,1.218-0.055,3.655-0.055c2.437,0,2.687,0,3.654,0.055
                    c0.571,0.007,1.135,0.112,1.67,0.311c0.786,0.303,1.407,0.925,1.712,1.712c0.196,0.534,0.302,1.099,0.311,1.669
                    c0.043,0.951,0.054,1.218,0.054,3.655c0,2.436,0,2.698-0.043,3.654H19.315z" />
                                </svg>
                            </SocialIcon>
                            <SocialIcon href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M21.593,7.203c-0.23-0.858-0.905-1.535-1.762-1.766C18.265,5.007,12,5,12,5S5.736,4.993,4.169,5.404
                    c-0.84,0.229-1.534,0.921-1.766,1.778c-0.413,1.566-0.417,4.814-0.417,4.814s-0.004,3.264,0.406,4.814
                    c0.23,0.857,0.905,1.534,1.763,1.765c1.582,0.43,7.83,0.437,7.83,0.437s6.265,0.007,7.831-0.403
                    c0.856-0.23,1.534-0.906,1.767-1.763C21.997,15.281,22,12.034,22,12.034S22.02,8.769,21.593,7.203z M9.996,15.005l0.005-6
                    l5.207,3.005L9.996,15.005z" />
                                </svg>
                            </SocialIcon>
                        </SocialLinks>
                    </Column>

                    <Column>
                        <ColumnTitle>서비스 안내</ColumnTitle>
                        <FooterLink to="/movies">영화</FooterLink>
                        <FooterLink to="/theaters">극장</FooterLink>
                        <FooterLink to="/booking">예매</FooterLink>
                        <FooterLink to="/events">이벤트</FooterLink>
                        <FooterLink to="/notice">공지사항</FooterLink>
                    </Column>

                    <Column>
                        <ColumnTitle>고객센터</ColumnTitle>
                        <FooterLink to="/faq">자주 묻는 질문</FooterLink>
                        <FooterLink to="/support">1:1 문의</FooterLink>
                        <FooterLink to="/lost">분실물 문의</FooterLink>
                        <FooterLink to="/terms">이용약관</FooterLink>
                        <FooterLink to="/privacy">개인정보처리방침</FooterLink>
                    </Column>

                    <Column>
                        <ColumnTitle>회사 정보</ColumnTitle>
                        <ExternalLink href="https://company.example.com/about" target="_blank" rel="noopener noreferrer">
                            회사 소개
                        </ExternalLink>
                        <ExternalLink href="https://company.example.com/recruit" target="_blank" rel="noopener noreferrer">
                            인재 채용
                        </ExternalLink>
                        <ExternalLink href="https://company.example.com/partners" target="_blank" rel="noopener noreferrer">
                            제휴/광고 문의
                        </ExternalLink>
                        <ExternalLink href="https://company.example.com/ir" target="_blank" rel="noopener noreferrer">
                            투자 정보
                        </ExternalLink>
                    </Column>

                    <Column>
                        <ColumnTitle>고객센터</ColumnTitle>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                            <strong>전화:</strong> 1544-0000
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                            <strong>운영시간:</strong> 09:00 - 18:00
                        </p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>
                            <strong>이메일:</strong> support@moviebooking.com
                        </p>
                    </Column>
                </TopSection>

                <Divider />

                <BottomSection>
                    <Copyright>
                        &copy; {new Date().getFullYear()} Movie Booking. All Rights Reserved.
                    </Copyright>

                    <LegalLinks>
                        <LegalLink to="/terms">이용약관</LegalLink>
                        <LegalLink to="/privacy"><strong>개인정보처리방침</strong></LegalLink>
                        <LegalLink to="/youth">청소년 보호정책</LegalLink>
                        <LegalLink to="/accessibility">접근성 안내</LegalLink>
                    </LegalLinks>
                </BottomSection>
                
            </FooterContent>

        </FooterContainer>
    );
};

export default Footer;

