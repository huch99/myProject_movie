import React, { type ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
}

const ButtonContainer = styled.button<ButtonProps>`
    display : inline-flex;
    align-items : center;
    justify-content : center;
    border-radius : 4px;
    font-weight : 500;
    transition : all 0.2s ease-in-out;
    cursor : pointer;

    ${props => props.fullWidth && css`width : 100%`}
    ${props => {
        switch (props.size) {
            case 'small':
                return css`
                    padding : 6px 12px;
                    font-size : 0.875rem;
                `;
            case 'large':
                return css`
                    padding : 12px 24px;
                    font-size : 1.125rem;
                `;
            default: // medium
                return css`
                    padding : 10px 20px;
                    font-size : 1rem;
                `;
        }
    }}
    ${props => {
        switch (props.variant) {
            case 'secondary':
                return css`
                    background-color : #f1f1f1;
                    color : #333;
                    border : none;

                    &:hover {
                        background-color : #e1e1e1;
                    }

                    &:active {
                        background-color : #d1d1d1;
                    }
                `;
            case 'outline':
                return css`
                    background-color : transparent;
                    color : #e51937;
                    border : 1px solid #e51937;

                    &:hover {
                        background-color : rgba(229, 25, 55, 0.05);
                    }

                    &:active {
                        background-color : rgba(229, 25, 55, 0.1);
                    }
                `;
            case 'text':
                return css`
                    background-color : transparent;
                    color : #e51937;
                    border : none;
                    padding-left : 8px;
                    padding-right : 8px;

                    &:hover {
                        background-color : rgba(229, 25, 55, 0.05);
                    }

                    &:active {
                        background-color : rgba(229, 25, 55, 0.1);
                    }
                `;
            default: // primary
                return css`
                    background-color : #e51937;
                    color : white;
                    border : none;

                    &:hover {
                        background-color : #c41730;
                    }

                    &:active {
                        background-color : #a3142a;
                    }
                `;
        }
    }}

    &:disabled {
        opacity : 0.6;
        cursor : not-allowed;
        pointer-events : none;
    }
`;

const LoadingSpinner = styled.div`
        display : inline-block;
        width : 16px;
        height : 16px;
        border : 2px solid rgba(255, 255, 255, 0.3);
        border-radius : 50%;
        border-top-color : #fff;
        animation : spin 1s ease-in-out infinite;
        margin-right : 8px;

        @keyframes spin {
            to {
                transform : rotate(360deg);
            }
        }
`;

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    isLoading = false,
    disabled,
    ...props
}) => {
    return (
        <ButtonContainer
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <LoadingSpinner />}
            {children}
        </ButtonContainer>
    )
};

export default Button;