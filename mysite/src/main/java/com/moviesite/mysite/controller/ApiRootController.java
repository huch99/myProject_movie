package com.moviesite.mysite.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ApiRootController {
    @GetMapping
    public ResponseEntity<String> getApiRoot() {
        return ResponseEntity.ok("API 서버가 정상 작동 중입니다.");
    }
}