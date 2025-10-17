import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa'; // react-icons 패키지 필요

const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <SearchContainer>
      <SearchIcon>
        <FaSearch />
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {value && (
        <ClearButton onClick={() => onChange('')}>
          ✕
        </ClearButton>
      )}
    </SearchContainer>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

// 스타일 컴포넌트
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f3f4;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  transition: all 0.2s;
  
  &:focus-within {
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
  }
`;

const SearchIcon = styled.div`
  color: #5f6368;
  margin-right: 0.8rem;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  padding: 0.3rem 0;
  color: #202124;
  outline: none;
  
  &::placeholder {
    color: #80868b;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #5f6368;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: rgba(95, 99, 104, 0.1);
  }
`;

export default SearchBar;