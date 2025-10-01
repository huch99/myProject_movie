package com.moviesite.mysite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.FAQ;

@Repository
public interface FAQRepository extends JpaRepository<FAQ, Long> {
	List<FAQ> findByCategoryOrderByOrderNumAsc(String category);

	List<FAQ> findAllByOrderByCategoryAscOrderNumAsc();
}
