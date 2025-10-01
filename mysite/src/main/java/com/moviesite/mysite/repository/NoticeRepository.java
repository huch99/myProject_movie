package com.moviesite.mysite.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
	List<Notice> findByIsImportantTrueOrderByCreatedAtDesc();

	List<Notice> findAllByOrderByCreatedAtDesc();
}
