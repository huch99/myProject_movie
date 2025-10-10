package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

	private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine; // Thymeleaf 템플릿 사용 시 필요

    // 시스템 이메일 주소 설정
    private static final String FROM_ADDRESS = "no-reply@moviebooking.com";

    // 간단한 텍스트 이메일 전송
    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(FROM_ADDRESS);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        
        mailSender.send(message);
    }

    // HTML 템플릿을 사용한 이메일 전송
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> variables) 
            throws MessagingException {
        // Thymeleaf 컨텍스트 설정
        Context context = new Context();
        if (variables != null) {
            variables.forEach(context::setVariable);
        }
        
        // 템플릿 처리
        String htmlContent = templateEngine.process(templateName, context);
        
        // 이메일 메시지 생성
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
        
        helper.setFrom(FROM_ADDRESS);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true = HTML 형식 사용
        
        mailSender.send(mimeMessage);
    }

    // 예매 확인 이메일 전송
    public void sendReservationConfirmation(String to, String userName, Map<String, Object> reservationDetails) 
            throws MessagingException {
        String subject = "[영화예매] 예매가 완료되었습니다";
        
        // 예매 정보를 변수로 추가
        reservationDetails.put("userName", userName);
        
        sendHtmlEmail(to, subject, "email/reservation-confirmation", reservationDetails);
    }

    // 결제 완료 이메일 전송
    public void sendPaymentConfirmation(String to, String userName, Map<String, Object> paymentDetails) 
            throws MessagingException {
        String subject = "[영화예매] 결제가 완료되었습니다";
        
        // 결제 정보를 변수로 추가
        paymentDetails.put("userName", userName);
        
        sendHtmlEmail(to, subject, "email/payment-confirmation", paymentDetails);
    }

    // 쿠폰 발급 알림 이메일 전송
    public void sendCouponIssuance(String to, String userName, Map<String, Object> couponDetails) 
            throws MessagingException {
        String subject = "[영화예매] 새로운 쿠폰이 발급되었습니다";
        
        // 쿠폰 정보를 변수로 추가
        couponDetails.put("userName", userName);
        
        sendHtmlEmail(to, subject, "email/coupon-issuance", couponDetails);
    }

    // 비밀번호 재설정 이메일 전송
    public void sendPasswordReset(String to, String userName, String temporaryPassword) 
            throws MessagingException {
        String subject = "[영화예매] 임시 비밀번호 안내";
        
        // 임시 비밀번호 정보를 변수로 추가
        Map<String, Object> variables = Map.of(
            "userName", userName,
            "temporaryPassword", temporaryPassword
        );
        
        sendHtmlEmail(to, subject, "email/password-reset", variables);
    }

    // 이메일 인증 코드 전송
    public void sendVerificationCode(String to, String userName, String verificationCode) 
            throws MessagingException {
        String subject = "[영화예매] 이메일 인증 코드 안내";
        
        // 인증 코드 정보를 변수로 추가
        Map<String, Object> variables = Map.of(
            "userName", userName,
            "verificationCode", verificationCode
        );
        
        sendHtmlEmail(to, subject, "email/verification-code", variables);
    }
}
