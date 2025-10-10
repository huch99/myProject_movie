package com.moviesite.mysite.model.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.moviesite.mysite.model.entity.Screen;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ScreenResponse {
    
    private Long screenId;
    private Long theaterId;
    private String theaterName;
    private String name;
    private String type;
    private Integer seatsCount;
    private Integer rowCount;
    private Integer columnCount;
    private String screenSize;
    private String audioSystem;
    private Boolean isAccessible;
    private LocalDateTime createdAt;
    private String formattedCreatedAt;
    
    // Entity -> DTO 변환 메서드
    public static ScreenResponse fromEntity(Screen screen) {
        if (screen == null) {
            return null;
        }
        
        return ScreenResponse.builder()
                .screenId(screen.getId())
                .theaterId(screen.getTheater().getId())
                .theaterName(screen.getTheater().getName())
                .name(screen.getName())
                .type(screen.getType())
                .seatsCount(screen.getSeatsCount())
                .rowCount(screen.getRowCount())
                .columnCount(screen.getColumnCount())
                .screenSize(screen.getScreenSize())
                .audioSystem(screen.getAudioSystem())
                .isAccessible(screen.getIsAccessible())
                .createdAt(screen.getCreatedAt())
                .formattedCreatedAt(screen.getCreatedAt() != null ?
                        screen.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")) : null)
                .build();
    }
}