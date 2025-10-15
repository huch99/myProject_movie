// // src/components/home/EventSection.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import styled from 'styled-components';
// import PropTypes from 'prop-types';
// import { FaCalendarAlt } from 'react-icons/fa';
// import ROUTE_PATHS from '../../constants/routePaths';

// /**
//  * 이벤트 섹션 컴포넌트
//  * 
//  * @param {Object} props
//  * @param {Array} props.events - 이벤트 목록 배열
//  * @param {string} props.title - 섹션 제목
//  */
// const EventSection = ({ events = [], title = "진행 중인 이벤트" }) => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [filteredEvents, setFilteredEvents] = useState([]);

//   // 이벤트 필터링
//   useEffect(() => {
//     if (!events || events.length === 0) {
//       setFilteredEvents([]);
//       return;
//     }

//     // 새 필터링 로직
//     const newFilteredEvents = activeTab === 'all'
//       ? events
//       : events.filter(event => event.category === activeTab);

//     // React.memo나 useMemo로 최적화하는 것이 더 효율적입니다
//     setFilteredEvents(newFilteredEvents);
//   }, [events, activeTab]);

//   // 이벤트가 없는 경우
//   if (!events || events.length === 0) {
//     return (
//       <SectionContainer>
//         <SectionHeader>
//           <SectionTitle>
//             <FaCalendarAlt />
//             <span>{title}</span>
//           </SectionTitle>
//         </SectionHeader>
//         <EmptyMessage>현재 진행 중인 이벤트가 없습니다.</EmptyMessage>
//       </SectionContainer>
//     );
//   }

//   // 이벤트 카테고리 추출
//   const categories = ['all', ...new Set(events.map(event => event.category))];

//   return (
//     <SectionContainer>
//       <SectionHeader>
//         <SectionTitle>
//           <FaCalendarAlt />
//           <span>{title}</span>
//         </SectionTitle>

//         <CategoryTabs>
//           {categories.map(category => (
//             <CategoryTab
//               key={category}
//               active={activeTab === category}
//               onClick={() => setActiveTab(category)}
//             >
//               {category === 'all' ? '전체' : category}
//             </CategoryTab>
//           ))}
//         </CategoryTabs>
//       </SectionHeader>

//       <EventGrid>
//         {filteredEvents.map(event => (
//           <EventCard key={event.id} to={ROUTE_PATHS.EVENT_DETAIL(event.id)}>
//             <EventImage src={event.imageUrl} alt={event.title} />
//             <EventContent>
//               <EventTitle>{event.title}</EventTitle>
//               <EventPeriod>
//                 {event.startDate} ~ {event.endDate}
//               </EventPeriod>
//             </EventContent>
//           </EventCard>
//         ))}
//       </EventGrid>

//       <MoreButton to={ROUTE_PATHS.EVENTS}>
//         이벤트 더보기
//       </MoreButton>
//     </SectionContainer>
//   );
// };

// // 스타일 컴포넌트
// const SectionContainer = styled.section`
//   margin-bottom: var(--spacing-xl);
// `;

// const SectionHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: var(--spacing-lg);
  
//   @media (max-width: 768px) {
//     flex-direction: column;
//     align-items: flex-start;
//     gap: var(--spacing-md);
//   }
// `;

// const SectionTitle = styled.h2`
//   display: flex;
//   align-items: center;
//   gap: var(--spacing-sm);
//   font-size: var(--font-size-xl);
//   font-weight: 700;
//   color: var(--color-text-primary);
  
//   svg {
//     color: var(--color-primary);
//   }
// `;

// const CategoryTabs = styled.div`
//   display: flex;
//   gap: var(--spacing-xs);
//   flex-wrap: wrap;
// `;

// const CategoryTab = styled.button`
//   padding: var(--spacing-xs) var(--spacing-md);
//   background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-surface)'};
//   color: ${props => props.active ? 'white' : 'var(--color-text-primary)'};
//   border: none;
//   border-radius: var(--border-radius-md);
//   cursor: pointer;
//   transition: var(--transition-fast);
  
//   &:hover {
//     background-color: ${props => props.active ? 'var(--color-primary)' : 'var(--color-surface-variant, rgba(0, 0, 0, 0.03))'};
//   }
// `;

// const EventGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
//   gap: var(--spacing-lg);
// `;

// const EventCard = styled(Link)`
//   display: flex;
//   flex-direction: column;
//   background-color: var(--color-surface);
//   border-radius: var(--border-radius-md);
//   overflow: hidden;
//   box-shadow: var(--box-shadow-sm);
//   transition: var(--transition-fast);
//   text-decoration: none;
//   color: var(--color-text-primary);
  
//   &:hover {
//     transform: translateY(-4px);
//     box-shadow: var(--box-shadow-md);
//   }
// `;

// const EventImage = styled.img`
//   width: 100%;
//   height: 160px;
//   object-fit: cover;
// `;

// const EventContent = styled.div`
//   padding: var(--spacing-md);
// `;

// const EventTitle = styled.h3`
//   font-size: var(--font-size-md);
//   font-weight: 600;
//   margin-bottom: var(--spacing-xs);
// `;

// const EventPeriod = styled.div`
//   font-size: var(--font-size-sm);
//   color: var(--color-text-secondary);
// `;

// const EmptyMessage = styled.div`
//   text-align: center;
//   padding: var(--spacing-xl);
//   color: var(--color-text-secondary);
//   background-color: var(--color-surface);
//   border-radius: var(--border-radius-md);
// `;

// const MoreButton = styled(Link)`
//   display: block;
//   width: fit-content;
//   margin: var(--spacing-lg) auto 0;
//   padding: var(--spacing-sm) var(--spacing-xl);
//   background-color: var(--color-surface);
//   color: var(--color-text-primary);
//   border: 1px solid var(--color-border);
//   border-radius: var(--border-radius-md);
//   text-decoration: none;
//   transition: var(--transition-fast);
  
//   &:hover {
//     background-color: var(--color-surface-variant, rgba(0, 0, 0, 0.03));
//   }
// `;

// EventSection.propTypes = {
//   events: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       title: PropTypes.string.isRequired,
//       imageUrl: PropTypes.string.isRequired,
//       startDate: PropTypes.string.isRequired,
//       endDate: PropTypes.string.isRequired,
//       category: PropTypes.string.isRequired
//     })
//   ),
//   title: PropTypes.string
// };

// export default EventSection;