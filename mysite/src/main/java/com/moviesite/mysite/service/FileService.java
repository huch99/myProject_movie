package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

	@Value("${file.upload-dir}")
    private String uploadDir;

    // 파일 업로드
    public String storeFile(MultipartFile file, String directory) {
        // 파일명 정리
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        
        // 파일명에 부적합한 문자가 있는지 확인
        if (originalFilename.contains("..")) {
            throw new BadRequestException("파일명에 부적합한 문자가 포함되어 있습니다: " + originalFilename);
        }
        
        // 파일 이름을 고유하게 변경
        String fileExtension = getFileExtension(originalFilename);
        String newFilename = UUID.randomUUID().toString() + "." + fileExtension;
        
        // 디렉토리 경로 생성
        Path targetDir = Paths.get(uploadDir + "/" + directory).toAbsolutePath().normalize();
        
        try {
            // 디렉토리가 없으면 생성
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }
            
            // 파일 저장
            Path targetLocation = targetDir.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            return directory + "/" + newFilename;
        } catch (IOException ex) {
            throw new BadRequestException("파일 " + originalFilename + " 저장에 실패했습니다. 다시 시도해주세요.", ex);
        }
    }

    // 파일 다운로드
    public Resource loadFileAsResource(String filePath) {
        try {
            Path fileLocation = Paths.get(uploadDir + "/" + filePath).toAbsolutePath().normalize();
            Resource resource = new UrlResource(fileLocation.toUri());
            
            if (resource.exists()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("파일을 찾을 수 없습니다: " + filePath);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("파일을 찾을 수 없습니다: " + filePath, ex);
        }
    }

    // 파일 삭제
    public boolean deleteFile(String filePath) {
        try {
            Path fileLocation = Paths.get(uploadDir + "/" + filePath).toAbsolutePath().normalize();
            return Files.deleteIfExists(fileLocation);
        } catch (IOException ex) {
            return false;
        }
    }

    // 영화 포스터 업로드
    public String uploadMoviePoster(MultipartFile file) {
        return storeFile(file, "posters");
    }

    // 사용자 프로필 이미지 업로드
    public String uploadProfileImage(MultipartFile file) {
        return storeFile(file, "profiles");
    }

    // 극장 이미지 업로드
    public String uploadTheaterImage(MultipartFile file) {
        return storeFile(file, "theaters");
    }
    
    // 파일 확장자 추출
    private String getFileExtension(String filename) {
        if (filename.lastIndexOf(".") != -1 && filename.lastIndexOf(".") != 0) {
            return filename.substring(filename.lastIndexOf(".") + 1);
        } else {
            return "";
        }
    }
}
