package com.moviesite.mysite.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.moviesite.mysite.exception.BadRequestException;
import com.moviesite.mysite.exception.ResourceNotFoundException;
import com.moviesite.mysite.model.dto.request.CouponRequest;
import com.moviesite.mysite.model.dto.response.CouponResponse;
import com.moviesite.mysite.model.entity.Coupon;
import com.moviesite.mysite.model.entity.Coupon.CouponStatus;
import com.moviesite.mysite.model.entity.Coupon.CouponType;
import com.moviesite.mysite.model.entity.Coupon.DiscountType;
import com.moviesite.mysite.model.entity.Movie;
import com.moviesite.mysite.model.entity.Theater;
import com.moviesite.mysite.model.entity.User;
import com.moviesite.mysite.model.entity.UserCoupon;
import com.moviesite.mysite.repository.CouponRepository;
import com.moviesite.mysite.repository.MovieRepository;
import com.moviesite.mysite.repository.TheaterRepository;
import com.moviesite.mysite.repository.UserCouponRepository;
import com.moviesite.mysite.repository.UserRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CouponService {

	private final CouponRepository couponRepository;
    private final UserRepository userRepository;
    private final UserCouponRepository userCouponRepository;
    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;

    // 모든 쿠폰 목록 조회 (페이징 처리)
    public Page<CouponResponse> getAllCoupons(String status, Pageable pageable) {
        Page<Coupon> coupons;
        
        if (status != null) {
            CouponStatus couponStatus = CouponStatus.valueOf(status);
            coupons = couponRepository.findByStatus(couponStatus, pageable);
        } else {
            coupons = couponRepository.findAll(pageable);
        }
        
        return coupons.map(CouponResponse::fromEntity);
    }

    // 현재 로그인한 사용자의 사용 가능한 쿠폰 목록 조회
    public List<CouponResponse> getMyAvailableCoupons() {
        User currentUser = getCurrentUser();
        
        // 사용자에게 발급된 쿠폰 중 사용 가능한 쿠폰만 조회
        List<UserCoupon> userCoupons = userCouponRepository.findByUserAndUsedFalseAndExpiredFalse(currentUser);
        
        return userCoupons.stream()
                .map(userCoupon -> CouponResponse.fromEntity(userCoupon.getCoupon()))
                .collect(Collectors.toList());
    }

    // 특정 쿠폰 조회
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = findCouponById(id);
        return CouponResponse.fromEntity(coupon);
    }

    // 쿠폰 코드로 쿠폰 조회
    public CouponResponse getCouponByCode(String code) {
        Coupon coupon = couponRepository.findByCouponCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with code: " + code));
        
        return CouponResponse.fromEntity(coupon);
    }

    // 새 쿠폰 생성
    @Transactional
    public CouponResponse createCoupon(CouponRequest couponRequest) {
        // 쿠폰 코드 중복 확인
        if (couponRepository.existsByCouponCode(couponRequest.getCouponCode())) {
            throw new BadRequestException("Coupon code already exists: " + couponRequest.getCouponCode());
        }
        
        Coupon coupon = new Coupon();
        updateCouponFromRequest(coupon, couponRequest);
        
        Coupon savedCoupon = couponRepository.save(coupon);
        return CouponResponse.fromEntity(savedCoupon);
    }

    // 쿠폰 정보 수정
    @Transactional
    public CouponResponse updateCoupon(Long id, CouponRequest couponRequest) {
        Coupon existingCoupon = findCouponById(id);
        
        // 쿠폰 코드 중복 확인 (변경된 경우)
        if (!existingCoupon.getCouponCode().equals(couponRequest.getCouponCode()) &&
                couponRepository.existsByCouponCode(couponRequest.getCouponCode())) {
            throw new BadRequestException("Coupon code already exists: " + couponRequest.getCouponCode());
        }
        
        updateCouponFromRequest(existingCoupon, couponRequest);
        existingCoupon.setUpdatedAt(LocalDateTime.now());
        
        Coupon updatedCoupon = couponRepository.save(existingCoupon);
        return CouponResponse.fromEntity(updatedCoupon);
    }

    // 쿠폰 상태 변경
    @Transactional
    public CouponResponse updateCouponStatus(Long id, String status) {
        Coupon coupon = findCouponById(id);
        
        coupon.setStatus(CouponStatus.valueOf(status));
        coupon.setUpdatedAt(LocalDateTime.now());
        
        Coupon updatedCoupon = couponRepository.save(coupon);
        return CouponResponse.fromEntity(updatedCoupon);
    }

    // 쿠폰 삭제
    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResourceNotFoundException("Coupon not found with id: " + id);
        }
        
        // 연관된 사용자 쿠폰도 함께 삭제
        userCouponRepository.deleteByCouponId(id);
        
        couponRepository.deleteById(id);
    }
    
 // 쿠폰 코드 등록/사용
    @Transactional
    public Map<String, Object> redeemCoupon(String couponCode) {
        // 쿠폰 존재 여부 확인
        Coupon coupon = couponRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid coupon code: " + couponCode));
        
        // 쿠폰 유효성 검사
        validateCoupon(coupon);
        
        User currentUser = getCurrentUser();
        
        // 이미 등록한 쿠폰인지 확인
        if (userCouponRepository.existsByUserAndCoupon(currentUser, coupon)) {
            throw new BadRequestException("이미 등록한 쿠폰입니다");
        }
        
        // 사용자당 사용 제한 확인
        if (coupon.getUsageLimitPerUser() != null) {
            long usageCount = userCouponRepository.countByUserAndCoupon(currentUser, coupon);
            if (usageCount >= coupon.getUsageLimitPerUser()) {
                throw new BadRequestException("이 쿠폰의 사용 횟수를 초과했습니다");
            }
        }
        
        // 전체 사용 제한 확인
        if (coupon.getTotalUsageLimit() != null) {
            long totalUsage = userCouponRepository.countByCoupon(coupon);
            if (totalUsage >= coupon.getTotalUsageLimit()) {
                throw new BadRequestException("이 쿠폰은 사용 가능한 수량이 모두 소진되었습니다");
            }
        }
        
        // 사용자에게 쿠폰 발급
        UserCoupon userCoupon = new UserCoupon();
        userCoupon.setUser(currentUser);
        userCoupon.setCoupon(coupon);
        userCoupon.setIssueDate(LocalDateTime.now());
        userCoupon.setExpiryDate(coupon.getExpiryDate());
        userCoupon.setUsed(false);
        userCoupon.setExpired(false);
        
        UserCoupon savedUserCoupon = userCouponRepository.save(userCoupon);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "쿠폰이 성공적으로 등록되었습니다");
        result.put("coupon", CouponResponse.fromEntity(coupon));
        result.put("userCouponId", savedUserCoupon.getId());
        
        return result;
    }
    
    // 예매 시 사용 가능한 쿠폰 목록 조회
    public List<CouponResponse> getAvailableCouponsForReservation(Long movieId, Long theaterId, BigDecimal amount) {
        User currentUser = getCurrentUser();
        
        // 사용자의 사용 가능한 쿠폰 목록 조회
        List<UserCoupon> userCoupons = userCouponRepository.findByUserAndUsedFalseAndExpiredFalse(currentUser);
        
        return userCoupons.stream()
                .map(UserCoupon::getCoupon)
                .filter(coupon -> {
                    // 쿠폰 유효성 검사
                    if (!coupon.isValid()) {
                        return false;
                    }
                    
                    // 최소 주문 금액 확인
                    if (coupon.getMinOrderPrice() != null && 
                            amount.compareTo(coupon.getMinOrderPrice()) < 0) {
                        return false;
                    }
                    
                    // 영화 특정 쿠폰 확인
                    if (coupon.getCouponType() == CouponType.MOVIE_SPECIFIC && 
                            movieId != null && 
                            coupon.getTargetMovie() != null &&
                            !coupon.getTargetMovie().getId().equals(movieId)) {
                        return false;
                    }
                    
                    // 극장 특정 쿠폰 확인
                    if (coupon.getCouponType() == CouponType.THEATER_SPECIFIC && 
                            theaterId != null && 
                            coupon.getTargetTheater() != null &&
                            !coupon.getTargetTheater().getId().equals(theaterId)) {
                        return false;
                    }
                    
                    return true;
                })
                .map(CouponResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    // 관리자: 쿠폰 대량 생성
    @Transactional
    public Map<String, Object> createCouponBatch(Map<String, Object> batchInfo) {
        int count = Integer.parseInt(batchInfo.get("count").toString());
        String prefix = (String) batchInfo.get("prefix");
        Map<String, Object> couponTemplate = (Map<String, Object>) batchInfo.get("couponTemplate");
        
        // 쿠폰 템플릿 생성
        CouponRequest templateRequest = new CouponRequest();
        templateRequest.setName((String) couponTemplate.get("name"));
        templateRequest.setDescription((String) couponTemplate.get("description"));
        templateRequest.setDiscountType((String) couponTemplate.get("discountType"));
        templateRequest.setDiscountValue(new BigDecimal(couponTemplate.get("discountValue").toString()));
        templateRequest.setMinOrderPrice(couponTemplate.get("minOrderPrice") != null ? 
                new BigDecimal(couponTemplate.get("minOrderPrice").toString()) : null);
        templateRequest.setMaxDiscountAmount(couponTemplate.get("maxDiscountAmount") != null ? 
                new BigDecimal(couponTemplate.get("maxDiscountAmount").toString()) : null);
        templateRequest.setIssueDate(LocalDateTime.parse(couponTemplate.get("issueDate").toString()));
        templateRequest.setExpiryDate(LocalDateTime.parse(couponTemplate.get("expiryDate").toString()));
        templateRequest.setUsageLimitPerUser(couponTemplate.get("usageLimitPerUser") != null ? 
                Integer.parseInt(couponTemplate.get("usageLimitPerUser").toString()) : null);
        templateRequest.setTotalUsageLimit(couponTemplate.get("totalUsageLimit") != null ? 
                Integer.parseInt(couponTemplate.get("totalUsageLimit").toString()) : null);
        templateRequest.setCouponType((String) couponTemplate.get("couponType"));
        templateRequest.setStatus((String) couponTemplate.get("status"));
        
        if (couponTemplate.get("targetMovieId") != null) {
            templateRequest.setTargetMovieId(Long.parseLong(couponTemplate.get("targetMovieId").toString()));
        }
        
        if (couponTemplate.get("targetTheaterId") != null) {
            templateRequest.setTargetTheaterId(Long.parseLong(couponTemplate.get("targetTheaterId").toString()));
        }
        
        List<String> generatedCodes = new ArrayList<>();
        List<Coupon> generatedCoupons = new ArrayList<>();
        
        // 쿠폰 대량 생성
        for (int i = 0; i < count; i++) {
            String couponCode = generateUniqueCouponCode(prefix);
            
            Coupon coupon = new Coupon();
            coupon.setCouponCode(couponCode);
            coupon.setName(templateRequest.getName());
            coupon.setDescription(templateRequest.getDescription());
            coupon.setDiscountType(DiscountType.valueOf(templateRequest.getDiscountType()));
            coupon.setDiscountValue(templateRequest.getDiscountValue());
            coupon.setMinOrderPrice(templateRequest.getMinOrderPrice());
            coupon.setMaxDiscountAmount(templateRequest.getMaxDiscountAmount());
            coupon.setIssueDate(templateRequest.getIssueDate());
            coupon.setExpiryDate(templateRequest.getExpiryDate());
            coupon.setUsageLimitPerUser(templateRequest.getUsageLimitPerUser());
            coupon.setTotalUsageLimit(templateRequest.getTotalUsageLimit());
            coupon.setCouponType(CouponType.valueOf(templateRequest.getCouponType()));
            coupon.setStatus(CouponStatus.valueOf(templateRequest.getStatus()));
            
            // 영화 및 극장 정보 설정 (필요한 경우)
            if (templateRequest.getTargetMovieId() != null) {
                Movie movie = movieRepository.findById(templateRequest.getTargetMovieId())
                        .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + templateRequest.getTargetMovieId()));
                coupon.setTargetMovie(movie);
            }
            
            if (templateRequest.getTargetTheaterId() != null) {
                Theater theater = theaterRepository.findById(templateRequest.getTargetTheaterId())
                        .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + templateRequest.getTargetTheaterId()));
                coupon.setTargetTheater(theater);
            }
            
            generatedCodes.add(couponCode);
            generatedCoupons.add(coupon);
        }
        
        // 쿠폰 일괄 저장
        List<Coupon> savedCoupons = couponRepository.saveAll(generatedCoupons);
        
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("count", savedCoupons.size());
        result.put("couponCodes", generatedCodes);
        
        return result;
    }
    
    // 쿠폰 유효성 검사
    private void validateCoupon(Coupon coupon) {
        LocalDateTime now = LocalDateTime.now();
        
        // 쿠폰 상태 확인
        if (coupon.getStatus() != CouponStatus.ACTIVE) {
            throw new BadRequestException("쿠폰이 활성화되지 않았습니다");
        }
        
        // 발행일 확인
        if (now.isBefore(coupon.getIssueDate())) {
            throw new BadRequestException("아직 사용할 수 없는 쿠폰입니다");
        }
        
        // 만료일 확인
        if (now.isAfter(coupon.getExpiryDate())) {
            throw new BadRequestException("만료된 쿠폰입니다");
        }
    }
    
    // 고유한 쿠폰 코드 생성
    private String generateUniqueCouponCode(String prefix) {
        String randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String couponCode = prefix + "-" + randomPart;
        
        // 중복 확인
        while (couponRepository.existsByCouponCode(couponCode)) {
            randomPart = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            couponCode = prefix + "-" + randomPart;
        }
        
        return couponCode;
    }
    
    // 현재 로그인한 사용자 조회
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    
    // 쿠폰 엔티티 조회 (내부 메서드)
    private Coupon findCouponById(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with id: " + id));
    }
    
 // 쿠폰 엔티티 업데이트 (내부 메서드)
    private void updateCouponFromRequest(Coupon coupon, CouponRequest request) {
        coupon.setCouponCode(request.getCouponCode());
        coupon.setName(request.getName());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(DiscountType.valueOf(request.getDiscountType()));
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderPrice(request.getMinOrderPrice());
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setIssueDate(request.getIssueDate());
        coupon.setExpiryDate(request.getExpiryDate());
        coupon.setUsageLimitPerUser(request.getUsageLimitPerUser());
        coupon.setTotalUsageLimit(request.getTotalUsageLimit());
        coupon.setCouponType(CouponType.valueOf(request.getCouponType()));
        coupon.setStatus(CouponStatus.valueOf(request.getStatus()));
        
        // 영화 및 극장 정보 설정 (필요한 경우)
        if (request.getTargetMovieId() != null) {
            Movie movie = movieRepository.findById(request.getTargetMovieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + request.getTargetMovieId()));
            coupon.setTargetMovie(movie);
        } else {
            coupon.setTargetMovie(null);
        }
        
        if (request.getTargetTheaterId() != null) {
            Theater theater = theaterRepository.findById(request.getTargetTheaterId())
                    .orElseThrow(() -> new ResourceNotFoundException("Theater not found with id: " + request.getTargetTheaterId()));
            coupon.setTargetTheater(theater);
        } else {
            coupon.setTargetTheater(null);
        }
    }
}
