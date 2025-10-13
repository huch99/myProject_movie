import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { loginUser } from '../../store/slices/authSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { FaUser, FaLock, FaGoogle, FaFacebookF } from 'react-icons/fa';
import { SiKakao } from 'react-icons/si';

/**
 * 로그인 폼 컴포넌트
 */
const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // 리다이렉트 경로 확인 (로그인 후 이동할 페이지)
    const { from } = location.state || { from: '/' };

    // 로그인 상태 관리
    const { loading, error } = useSelector((state) => state.auth);

    // 폼 상태 관리
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [formError, setFormError] = useState('');

    // 이메일 입력 핸들러
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setFormError('');
    };

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setFormError('');
    };

    // 로그인 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 입력값 검증
        if (!email.trim()) {
            setFormError('이메일을 입력해주세요.');
            return;
        }

        if (!password) {
            setFormError('비밀번호를 입력해주세요.');
            return;
        }

        try {
            // 로그인 액션 디스패치
            const resultAction = await dispatch(loginUser({ email, password })).unwrap();

            // 로그인 성공 시 리다이렉트
            navigate(from);
        } catch (err) {
            console.error('로그인 실패:', err);
            setFormError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <FormContainer>
            <FormTitle>로그인</FormTitle>

            {/* 에러 메시지 */}
            {(formError || error) && (
                <ErrorMessage>
                    {formError || error}
                </ErrorMessage>
            )}

            <Form onSubmit={handleSubmit}>
                {/* 이메일 입력 */}
                <InputGroup>
                    <StyledInput
                        label="이메일"
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="이메일 주소를 입력하세요"
                        icon={<FaUser />}
                        required
                    />
                </InputGroup>

                {/* 비밀번호 입력 */}
                <InputGroup>
                    <StyledInput
                        label="비밀번호"
                        type="password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="비밀번호를 입력하세요"
                        icon={<FaLock />}
                        required
                    />
                </InputGroup>

                {/* 로그인 옵션 */}
                <FormOptions>
                    <RememberMe>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe">로그인 상태 유지</label>
                    </RememberMe>

                    <ForgotPassword to="/forgot-password">
                        비밀번호 찾기
                    </ForgotPassword>
                </FormOptions>

                {/* 로그인 버튼 */}
                <LoginButton
                    type="submit"
                    disabled={loading}
                    fullWidth
                >
                    {loading ? '로그인 중...' : '로그인'}
                </LoginButton>

                {/* 회원가입 링크 */}
                <RegisterLink>
                    계정이 없으신가요? <Link to="/register">회원가입</Link>
                </RegisterLink>

                {/* 소셜 로그인 */}
                <SocialLoginSection>
                    <SocialDivider>
                        <DividerLine />
                        <DividerText>또는</DividerText>
                        <DividerLine />
                    </SocialDivider>

                    <SocialLoginButtons>
                        <SocialButton type="button" $socialType="google">
                            <FaGoogle />
                            <span>Google 계정으로 로그인</span>
                        </SocialButton>

                        <SocialButton type="button" $socialType="kakao">
                            <SiKakao />
                            <span>카카오 계정으로 로그인</span>
                        </SocialButton>

                        <SocialButton type="button" $socialType="facebook">
                            <FaFacebookF />
                            <span>Facebook 계정으로 로그인</span>
                        </SocialButton>
                    </SocialLoginButtons>
                </SocialLoginSection>
            </Form>
        </FormContainer>
    );
};

// 스타일 컴포넌트
const FormContainer = styled.div`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow-md);
`;

const FormTitle = styled.h2`
  font-size: var(--font-size-2xl);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-primary);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: var(--spacing-md);
`;

const StyledInput = styled(Input)`
  width: 100%;
`;

const FormOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  input {
    width: 16px;
    height: 16px;
  }
  
  label {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    cursor: pointer;
  }
`;

const ForgotPassword = styled(Link)`
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  
  &:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
`;

const LoginButton = styled(Button)`
  margin-bottom: var(--spacing-md);
  height: 48px;
  font-weight: 600;
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  
  a {
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SocialLoginSection = styled.div`
  margin-top: var(--spacing-md);
`;

const SocialDivider = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: var(--color-border);
`;

const DividerText = styled.span`
  padding: 0 var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`;

const SocialLoginButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
  
  ${({ $socialType }) => {
        switch ($socialType) {
            case 'google':
                return `
          background-color: white;
          color: #333333;
          border: 1px solid #dddddd;
          
          &:hover {
            background-color: #f5f5f5;
          }
        `;
            case 'kakao':
                return `
          background-color: #FEE500;
          color: #3C1E1E;
          border: none;
          
          &:hover {
            background-color: #FFDD00;
          }
        `;
            case 'facebook':
                return `
          background-color: #1877F2;
          color: white;
          border: none;
          
          &:hover {
            background-color: #166FE5;
          }
        `;
            default:
                return '';
        }
    }}
`;

const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: var(--color-error);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
  border-left: 3px solid var(--color-error);
`;

export default LoginForm;