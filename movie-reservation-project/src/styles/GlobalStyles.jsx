// 전역 스타일
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* 폰트 임포트 */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
  
  /* 변수 정의 */
  :root {
    /* 색상 변수 */
    --color-primary: ${props => props.theme.colors.primary};
    --color-secondary: ${props => props.theme.colors.secondary};
    --color-background: ${props => props.theme.colors.background};
    --color-surface: ${props => props.theme.colors.surface};
    --color-text-primary: ${props => props.theme.colors.text.primary};
    --color-text-secondary: ${props => props.theme.colors.text.secondary};
    --color-text-disabled: ${props => props.theme.colors.text.disabled};
    --color-border: ${props => props.theme.colors.border};
    --color-error: ${props => props.theme.colors.error};
    --color-success: ${props => props.theme.colors.success};
    --color-warning: ${props => props.theme.colors.warning};
    --color-info: ${props => props.theme.colors.info};
    --color-button-primary: ${props => props.theme.colors.button.primary};
    --color-button-secondary: ${props => props.theme.colors.button.secondary};
    --color-button-disabled: ${props => props.theme.colors.button.disabled};
    
    /* 폰트 변수 */
    --font-regular: ${props => props.theme.fonts.regular};
    --font-heading: ${props => props.theme.fonts.heading};
    
    /* 간격 변수 */
    --spacing-xs: ${props => props.theme.spacing.xs};
    --spacing-sm: ${props => props.theme.spacing.sm};
    --spacing-md: ${props => props.theme.spacing.md};
    --spacing-lg: ${props => props.theme.spacing.lg};
    --spacing-xl: ${props => props.theme.spacing.xl};
    
    /* 테두리 반경 변수 */
    --border-radius-sm: ${props => props.theme.borderRadius.sm};
    --border-radius-md: ${props => props.theme.borderRadius.md};
    --border-radius-lg: ${props => props.theme.borderRadius.lg};
    --border-radius-full: ${props => props.theme.borderRadius.full};
    
    /* 그림자 변수 */
    --box-shadow-sm: ${props => props.theme.boxShadow.sm};
    --box-shadow-md: ${props => props.theme.boxShadow.md};
    --box-shadow-lg: ${props => props.theme.boxShadow.lg};
    
    /* 트랜지션 변수 */
    --transition-default: ${props => props.theme.transition.default};
    --transition-fast: ${props => props.theme.transition.fast};
    --transition-slow: ${props => props.theme.transition.slow};
  }

  /* 리셋 스타일 */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html, body, #root {
    height: 100%;
  }
  
  body {
    font-family: var(--font-regular);
    font-size: 16px;
    line-height: 1.5;
    color: var(--color-text-primary);
    background-color: var(--color-background);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  /* 타이포그래피 */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  h1 {
    font-size: 2.5rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  h3 {
    font-size: 1.75rem;
  }
  
  h4 {
    font-size: 1.5rem;
  }
  
  h5 {
    font-size: 1.25rem;
  }
  
  h6 {
    font-size: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: var(--transition-fast);
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  /* 버튼 기본 스타일 */
  button {
    font-family: var(--font-regular);
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    
    &:disabled {
      cursor: not-allowed;
    }
  }
  
  /* 입력 필드 기본 스타일 */
  input, textarea, select {
    font-family: var(--font-regular);
    font-size: 1rem;
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-sm);
    padding: 0.75rem 1rem;
    width: 100%;
    transition: var(--transition-fast);
    
    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.2);
    }
    
    &:disabled {
      background-color: rgba(0, 0, 0, 0.05);
      cursor: not-allowed;
    }
  }
  
  /* 목록 기본 스타일 */
  ul, ol {
    list-style: none;
    padding-left: 0;
  }
  
  /* 이미지 기본 스타일 */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  
  /* 테이블 기본 스타일 */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid var(--color-border);
  }
  
  th {
    font-weight: 700;
  }
  
  /* 스크롤바 스타일링 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  
   /* 유틸리티 클래스 */
  .text-center {
    text-align: center;
  }
  
  .text-right {
    text-align: right;
  }
  
  .text-primary {
    color: var(--color-primary);
  }
  
  .text-secondary {
    color: var(--color-secondary);
  }
  
  .text-error {
    color: var(--color-error);
  }
  
  .text-success {
    color: var(--color-success);
  }
  
  .text-warning {
    color: var(--color-warning);
  }
  
  .text-info {
    color: var(--color-info);
  }
  
  .mt-1 { margin-top: var(--spacing-xs); }
  .mt-2 { margin-top: var(--spacing-sm); }
  .mt-3 { margin-top: var(--spacing-md); }
  .mt-4 { margin-top: var(--spacing-lg); }
  .mt-5 { margin-top: var(--spacing-xl); }
  
  .mb-1 { margin-bottom: var(--spacing-xs); }
  .mb-2 { margin-bottom: var(--spacing-sm); }
  .mb-3 { margin-bottom: var(--spacing-md); }
  .mb-4 { margin-bottom: var(--spacing-lg); }
  .mb-5 { margin-bottom: var(--spacing-xl); }
  
  .ml-1 { margin-left: var(--spacing-xs); }
  .ml-2 { margin-left: var(--spacing-sm); }
  .ml-3 { margin-left: var(--spacing-md); }
  .ml-4 { margin-left: var(--spacing-lg); }
  .ml-5 { margin-left: var(--spacing-xl); }
  
  .mr-1 { margin-right: var(--spacing-xs); }
  .mr-2 { margin-right: var(--spacing-sm); }
  .mr-3 { margin-right: var(--spacing-md); }
  .mr-4 { margin-right: var(--spacing-lg); }
  .mr-5 { margin-right: var(--spacing-xl); }
  
  .p-1 { padding: var(--spacing-xs); }
  .p-2 { padding: var(--spacing-sm); }
  .p-3 { padding: var(--spacing-md); }
  .p-4 { padding: var(--spacing-lg); }
  .p-5 { padding: var(--spacing-xl); }
  
  .flex {
    display: flex;
  }
  
  .flex-col {
    flex-direction: column;
  }
  
  .items-center {
    align-items: center;
  }
  
  .justify-center {
    justify-content: center;
  }
  
  .justify-between {
    justify-content: space-between;
  }
  
  .justify-around {
    justify-content: space-around;
  }
  
  .gap-1 { gap: var(--spacing-xs); }
  .gap-2 { gap: var(--spacing-sm); }
  .gap-3 { gap: var(--spacing-md); }
  .gap-4 { gap: var(--spacing-lg); }
  .gap-5 { gap: var(--spacing-xl); }
  
  .w-full {
    width: 100%;
  }
  
  .h-full {
    height: 100%;
  }
  
  .hidden {
    display: none;
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  /* 반응형 컨테이너 */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    
    @media (max-width: 768px) {
      padding: 0 var(--spacing-sm);
    }
  }
  
  /* 애니메이션 */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-slideInUp {
    animation: slideInUp 0.4s ease-out;
  }
  
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  
  /* 접근성 포커스 스타일 */
  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  /* 다크 모드 특정 스타일 */
  .theme-dark {
    img {
      filter: brightness(0.9);
    }
    
    ::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.2);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

export default GlobalStyles;