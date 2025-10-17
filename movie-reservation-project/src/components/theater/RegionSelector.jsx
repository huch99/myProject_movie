import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const RegionSelector = ({ regions, selectedRegion, onSelectRegion }) => {
    return (
        <SelectorContainer>
            <SelectorTitle>지역 선택</SelectorTitle>
            <RegionList>
                {regions.map((region) => (
                    <RegionItem
                        key={region}
                        $isSelected={region === selectedRegion}
                        onClick={() => onSelectRegion(region)}
                    >
                        {region}
                    </RegionItem>
                ))}
            </RegionList>
        </SelectorContainer>
    );
};

RegionSelector.propTypes = {
  regions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedRegion: PropTypes.string.isRequired,
  onSelectRegion: PropTypes.func.isRequired
};

// 스타일 컴포넌트
const SelectorContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SelectorTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.8rem;
  color: #333;
`;

const RegionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RegionItem = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  background-color: ${props => props.isSelected ? '#1a73e8' : '#f1f3f4'};
  color: ${props => props.isSelected ? '#fff' : '#333'};
  border: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.isSelected ? '#1a73e8' : '#e8eaed'};
  }
`;

export default RegionSelector;