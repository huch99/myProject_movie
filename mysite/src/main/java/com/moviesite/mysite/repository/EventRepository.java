package com.moviesite.mysite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
	List<Event> findByIsActiveTrueOrderByEndDateDesc();

	List<Event> findByIsActiveFalseOrderByEndDateDesc();
}
