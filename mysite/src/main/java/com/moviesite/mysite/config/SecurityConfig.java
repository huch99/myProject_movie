package com.moviesite.mysite.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.moviesite.mysite.security.JwtAuthorizationFilter;
import com.moviesite.mysite.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	@Autowired
	private JwtUtil jwtUtil;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    http
	        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
	        .csrf(csrf -> csrf.disable())
	        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
	        .authorizeHttpRequests(authorize -> authorize
	            // 공개 API 엔드포인트
	            .requestMatchers("/api/auth/**").permitAll()
	            .requestMatchers("/api/movies/**").permitAll()
	            .requestMatchers("/api/theaters/**").permitAll()
	            .requestMatchers("/api/screenings/**").permitAll()
	            .requestMatchers("/api/events/**").permitAll()
	            .requestMatchers("/api/notices/**").permitAll()
	            .requestMatchers("/api/faqs/**").permitAll()
	            .requestMatchers("/**").permitAll()
	            // Swagger UI 관련 경로
	            .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
	            // 나머지는 인증 필요
	            .anyRequest().authenticated()
	        )
	        .addFilterBefore(new JwtAuthorizationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

	    return http.build();
	}
	
	// CORS 설정을 위한 Bean 추가
		@Bean
	    public CorsConfigurationSource corsConfigurationSource() {
	        CorsConfiguration configuration = new CorsConfiguration();
	        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "https://your-domain.com")); // 여기에 프론트엔드 주소 추가
	        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
	        configuration.setExposedHeaders(Arrays.asList("Authorization"));
	        configuration.setAllowCredentials(true);
	        
	        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", configuration);
	        return source;
	    }
		
		// WebMvcConfigurer는 별도 클래스로 분리하거나 제거해도 됩니다
		@Bean
	    public WebMvcConfigurer corsConfigurer() {
	        return new WebMvcConfigurer() {
	            @Override
	            public void addCorsMappings(CorsRegistry registry) {
	                registry.addMapping("/**")
	                    .allowedOrigins("http://localhost:5173", "http://localhost:3000", "https://your-domain.com")
	                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
	                    .allowedHeaders("Authorization", "Content-Type", "X-Requested-With")
	                    .exposedHeaders("Authorization")
	                    .allowCredentials(true);
	            }
	        };
	    }
	
	@Configuration
	public class WebConfig implements WebMvcConfigurer {
	    
	    @Override
	    public void addCorsMappings(CorsRegistry registry) {
	        registry.addMapping("/**")
	                .allowedOrigins("http://localhost:3000", "https://your-domain.com")
	                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
	                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With")
	                .exposedHeaders("Authorization")
	                .allowCredentials(true);
	    }
	}
	
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
