// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import { fetchTheaters } from '../../store/slices/theaterSlice';
// import TheaterCard from './TheaterCard';
// import Pagination from '../common/Pagination';
// import Loading from '../common/Loading';
// import { PAGINATION } from '../../styles/variables';


// /**
//  * 극장 목록을 표시하는 컴포넌트
//  * 
//  * @param {Object} props
//  * @param {string} props.region - 지역 필터 (선택 사항)
//  * @param {number} props.initialPage - 초기 페이지 번호
//  * @param {number} props.theatersPerPage - 페이지당 극장 수
//  */
// const TheaterList = ({ 
//   region = '',
//   initialPage = 0,
//   theatersPerPage = PAGINATION.THEATERS_PER_PAGE
// }) => {
//   const dispatch = useDispatch();
//   const { theaters, loading, error } = useSelector(state => state.theaters);
//   const [currentPage, setCurrentPage] = useState(initialPage);
//   const [filteredTheaters, setFilteredTheaters] = useState([]);
//   const [totalPages, setTotalPages] = useState(0);
  
//   // 극장 목록 가져오기
//   useEffect(() => {
//     dispatch(fetchTheaters({ page: currentPage, size: theatersPerPage, region }));
//   }, [dispatch, currentPage, theatersPerPage, region]);

//   console.log(filteredTheaters);
  
//   // 극장 데이터 처리 및 필터링
//   useEffect(() => {
//     if (theaters) {
//       let theaterList = theaters.content || [];
//       setTotalPages(theaters.totalPages || 1);
      
//       // 지역 필터링 적용 (서버에서 이미 필터링된 경우 불필요할 수 있음)
//       if (region && theaterList.length > 0) {
//         theaterList = theaterList.filter(theater => theater.region === region);
//       }
      
//       setFilteredTheaters(theaterList);
//     }
//   }, [theaters, region]);
  
//   // 페이지 변경 핸들러
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     // 페이지 변경 시 상단으로 스크롤
//     window.scrollTo(0, 0);
//   };
  
//   // 로딩 중 표시
//   if (loading && filteredTheaters.length === 0) {
//     return <Loading text="극장 정보를 불러오는 중입니다..." />;
//   }
  
//   // 에러 표시
//   if (error) {
//     return <ErrorMessage>{error}</ErrorMessage>;
//   }
  
//   return (
//     <TheaterListContainer>
//       <ListHeader>
//         <ListTitle>{region ? `${region} 극장` : '전체 극장'}</ListTitle>
//         <TheaterCount>{filteredTheaters.length}개의 극장</TheaterCount>
//       </ListHeader>
      
//       {filteredTheaters.length === 0 ? (
//         <NoTheatersMessage>
//           {region ? `${region}에 등록된 극장이 없습니다.` : '등록된 극장이 없습니다.'}
//         </NoTheatersMessage>
//       ) : (
//         <>
//           <TheatersGrid>
//             {filteredTheaters.map(theater => (
//               <TheaterCardWrapper key={theater.id}>
//                 <TheaterCard theater={theater} />
//               </TheaterCardWrapper>
//             ))}
//           </TheatersGrid>
          
//           {totalPages > 1 && (
//             <PaginationWrapper>
//               <Pagination
//                 currentPage={currentPage}
//                 totalPages={totalPages}
//                 onPageChange={handlePageChange}
//               />
//             </PaginationWrapper>
//           )}
//         </>
//       )}
//     </TheaterListContainer>
//   );
// };

// // 스타일 컴포넌트
// const TheaterListContainer = styled.div`
//   width: 100%;
// `;

// const ListHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: var(--spacing-lg);
// `;

// const ListTitle = styled.h2`
//   font-size: var(--font-size-2xl);
//   font-weight: 700;
//   color: var(--color-text-primary);
//   margin: 0;
// `;

// const TheaterCount = styled.span`
//   color: var(--color-text-secondary);
//   font-size: var(--font-size-md);
// `;

// const TheatersGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: var(--spacing-lg);
  
//   @media (max-width: 1024px) {
//     grid-template-columns: repeat(2, 1fr);
//   }
  
//   @media (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const TheaterCardWrapper = styled.div`
//   height: 100%;
// `;

// const PaginationWrapper = styled.div`
//   margin-top: var(--spacing-xl);
//   display: flex;
//   justify-content: center;
// `;

// const NoTheatersMessage = styled.div`
//   text-align: center;
//   padding: var(--spacing-xl);
//   color: var(--color-text-secondary);
//   font-size: var(--font-size-lg);
// `;

// const ErrorMessage = styled.div`
//   text-align: center;
//   padding: var(--spacing-xl);
//   color: var(--color-error);
//   font-size: var(--font-size-lg);
//   background-color: var(--color-surface);
//   border-radius: var(--border-radius-md);
//   border-left: 4px solid var(--color-error);
// `;

// TheaterList.propTypes = {
//   region: PropTypes.string,
//   initialPage: PropTypes.number,
//   theatersPerPage: PropTypes.number
// };

// export default TheaterList;