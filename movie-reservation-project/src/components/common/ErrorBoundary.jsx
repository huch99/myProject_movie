// src/components/common/ErrorBoundary.jsx
import React, { Component } from 'react';
import styled from 'styled-components';

// 에러 발생 시 보여줄 스타일 컴포넌트
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color); /* 테마에 맞게 배경색 설정 */
  color: var(--text-color); /* 테마에 맞게 텍스트색 설정 */
  text-align: center;
  padding: 20px;
`;

const ErrorMessage = styled.h1`
  font-size: 2em;
  margin-bottom: 15px;
`;

const ErrorDescription = styled.p`
  font-size: 1.2em;
  margin-bottom: 30px;
`;

const HomeButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: var(--primary-color); /* 테마에 맞게 버튼색 설정 */
  color: var(--button-text-color);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--primary-dark-color);
  }
`;

/**
 * React Error Boundary 컴포넌트
 * 자식 컴포넌트 트리에서 발생하는 JavaScript 에러를 잡아 대체 UI를 표시합니다.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { haserror: false, error: null, errorInfo: null };
  }

  // 에러 발생 시 호출되어 state를 업데이트하여 대체 UI 렌더링
  static getDerivedStateFromError(error) {
    // 다음 렌더링에서 폴백 UI를 보여주도록 상태를 업데이트 합니다.
    return { haserror: true };
  }

  // 에러 로그를 기록하는 메소드
  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록할 수 있습니다.
    console.error("ErrorBoundary에서 에러가 발생했습니다:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  // 홈으로 돌아가는 버튼 핸들러
  handleGoHome = () => {
    // 예를 들어, 애플리케이션의 홈 경로로 이동합니다.
    window.location.href = '/'; // 또는 history.push('/') 등을 사용할 수 있습니다.
  };

  render() {
    if (this.state.haserror) {
      // 폴백 UI를 렌더링
      return (
        <ErrorContainer>
          <ErrorMessage>🚫 오류가 발생했습니다 🚫</ErrorMessage>
          <ErrorDescription>
            죄송합니다. 페이지를 표시하는 도중 문제가 발생했습니다.
            문제가 계속되면 관리자에게 문의해주세요.
          </ErrorDescription>
          {/* 개발 모드에서만 상세 에러 정보 표시 */}
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', textAlign: 'left', marginBottom: '20px' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
          <HomeButton onClick={this.handleGoHome}>
            홈으로 돌아가기
          </HomeButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;