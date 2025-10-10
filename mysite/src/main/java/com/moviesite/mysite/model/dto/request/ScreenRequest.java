package com.moviesite.mysite.model.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScreenRequest {
    
    @NotNull(message = "극장 ID는 필수 입력값입니다")
    private Long theaterId;
    
    @NotBlank(message = "상영관 이름은 필수 입력값입니다")
    private String name;
    
    private String type;
    
    @NotNull(message = "좌석 수는 필수 입력값입니다")
    @Min(value = 1, message = "좌석 수는 1 이상이어야 합니다")
    private Integer seatsCount;
    
    @NotNull(message = "행 수는 필수 입력값입니다")
    @Min(value = 1, message = "행 수는 1 이상이어야 합니다")
    private Integer rowCount;
    
    @NotNull(message = "열 수는 필수 입력값입니다")
    @Min(value = 1, message = "열 수는 1 이상이어야 합니다")
    private Integer columnCount;
    
    private String screenSize;
    
    private String audioSystem;
    
    private Boolean isAccessible = true;
}