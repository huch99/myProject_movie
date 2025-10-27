package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

	// 응답 상태 코드
    private int status;
    
    // 응답 메시지
    private String message;
    
    // 응답 데이터
    private T data;
    
    // 오류 코드 (있는 경우)
    private String errorCode;
    
    // 응답 시간
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    // 성공 응답 생성 (데이터 포함)
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .status(200)
                .message("요청이 성공적으로 처리되었습니다.")
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    // 성공 응답 생성 (메시지와 데이터 포함)
    public static <T> ApiResponse<T> success(String message, T data) {
        return ApiResponse.<T>builder()
                .status(200)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    // 성공 응답 생성 (상태 코드, 메시지, 데이터 포함)
    public static <T> ApiResponse<T> success(int status, String message, T data) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .data(data)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    // 오류 응답 생성 (메시지만 포함)
    public static <T> ApiResponse<T> error(String message) {
        return ApiResponse.<T>builder()
                .status(400)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    // 오류 응답 생성 (상태 코드와 메시지 포함)
    public static <T> ApiResponse<T> error(int status, String message) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
    
    // 오류 응답 생성 (상태 코드, 메시지, 오류 코드 포함)
    public static <T> ApiResponse<T> error(int status, String message, String errorCode) {
        return ApiResponse.<T>builder()
                .status(status)
                .message(message)
                .errorCode(errorCode)
                .timestamp(LocalDateTime.now())
                .build();
    }

}
