package com.moviesite.mysite.exception;

import java.net.MalformedURLException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
private static final long serialVersionUID = 1L;
    
    public ResourceNotFoundException() {
        super();
    }
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public ResourceNotFoundException(Throwable cause) {
        super(cause);
    }
    
    // 특정 리소스를 찾을 수 없을 때 사용할 수 있는 편의 메서드
    public static ResourceNotFoundException forId(String resourceName, Object id) {
        return new ResourceNotFoundException(resourceName + " not found with id: " + id);
    }
    
    // 특정 필드 값으로 리소스를 찾을 수 없을 때 사용할 수 있는 편의 메서드
    public static ResourceNotFoundException forField(String resourceName, String fieldName, Object fieldValue) {
        return new ResourceNotFoundException(resourceName + " not found with " + fieldName + ": " + fieldValue);
    }
}
