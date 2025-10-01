package com.moviesite.mysite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviesite.mysite.model.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
	Optional<Payment> findByBookingId(Long bookingId);

	Optional<Payment> findByPaymentNumber(String paymentNumber);
}
