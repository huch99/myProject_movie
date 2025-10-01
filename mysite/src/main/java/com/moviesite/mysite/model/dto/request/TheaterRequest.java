package com.moviesite.mysite.model.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheaterRequest {
	private String name;
    private String location;
    private String address;
    private String phone;
    private Integer totalScreens; // 스크린 정보는 별도의 요청으로 추가될 수 있으므로, 초기 생성 시에는 간단히 개수만 포함
    
 // Getter 메서드
    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public String getAddress() {
        return address;
    }

    public String getPhone() {
        return phone;
    }

    public Integer getTotalScreens() {
        return totalScreens;
    }

    // Setter 메서드
    public void setName(String name) {
        this.name = name;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setTotalScreens(Integer totalScreens) {
        this.totalScreens = totalScreens;
    }

}
