import type React from "react";
import type { ReactNode } from "react";
import styled from "styled-components";

interface SectionTitleProps {
  children: ReactNode;
  margin?: string;
  align?: 'left' | 'center' | 'right';
  withLine?: boolean;
}

const TitleContainer = styled.div<{ margin?: string, withLine?: boolean }>`
  margin: ${props => props.margin || '40px 0 20px'};
  ${props => props.withLine && `
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  `}
`;

const Title = styled.h2<{ align?: string }>`
  font-size: 1.8rem;
  color: #333;
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
`;

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  children, 
  margin, 
  align = 'left',
  withLine = true
}) => {
  return (
    <TitleContainer margin={margin} withLine={withLine}>
      <Title align={align}>{children}</Title>
    </TitleContainer>
  );
};

export default SectionTitle;