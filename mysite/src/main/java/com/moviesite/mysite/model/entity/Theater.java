package com.moviesite.mysite.model.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "theaters")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Theater {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private String address;
    
    private String contact;
    
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String facilities;
    
    @Column(name = "special_screens", columnDefinition = "TEXT")
    private String specialScreens;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String features;
    
    private String parking;
    
    private String transportation;
    
    private Integer capacity;
    
    private String type;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
 // 편의 메서드: 쉼표로 구분된 문자열을 리스트로 변환
    @Transient
    public List<String> getFacilitiesList() {
        if (this.facilities == null || this.facilities.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(this.facilities.split(","));
    }
    
    @Transient
    public List<String> getSpecialScreensList() {
        if (this.specialScreens == null || this.specialScreens.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(this.specialScreens.split(","));
    }
    
    @Transient
    public List<String> getFeaturesList() {
        if (this.features == null || this.features.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(this.features.split(","));
    }
    
    // JPA 엔티티 생명주기 콜백 메서드
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
