package com.moviesite.mysite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MysiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(MysiteApplication.class, args);
	}

}
