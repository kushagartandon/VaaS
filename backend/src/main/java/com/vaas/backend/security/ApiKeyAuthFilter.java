package com.vaas.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vaas.backend.model.PartnerPlatform;
import com.vaas.backend.repository.PartnerPlatformRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Component
public class ApiKeyAuthFilter extends OncePerRequestFilter {

    public static final String AUTHENTICATED_PLATFORM_ATTR = "authenticatedPlatform";

    private final PartnerPlatformRepository partnerPlatformRepository;
    private final ObjectMapper objectMapper;

    public ApiKeyAuthFilter(PartnerPlatformRepository partnerPlatformRepository, ObjectMapper objectMapper) {
        this.partnerPlatformRepository = partnerPlatformRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Only enforce API key authentication on /api/platform/** routes
        if (!path.startsWith("/api/platform")) {
            return true;
        }
        // Allow CORS OPTIONS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        // Allow public endpoint to fetch registered platform keys for developer playground
        if ("/api/platform/keys".equalsIgnoreCase(path)) {
            return true;
        }
        return false;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String apiKey = request.getHeader("X-API-Key");

        if (apiKey == null || apiKey.isBlank()) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                apiKey = authHeader.substring(7).trim();
            }
        }

        if (apiKey == null || apiKey.isBlank()) {
            sendUnauthorizedError(
                response,
                "Missing required API key. Please pass 'X-API-Key' or 'Authorization: Bearer <key>'."
            );
            return;
        }

        Optional<PartnerPlatform> platformOpt = partnerPlatformRepository.findByApiKeyAndActiveTrue(apiKey.trim());

        if (platformOpt.isEmpty()) {
            sendUnauthorizedError(
                response,
                "Invalid or revoked API key."
            );
            return;
        }

        PartnerPlatform platform = platformOpt.get();
        platform.setLastUsedAt(LocalDateTime.now());
        partnerPlatformRepository.save(platform);

        // Store authenticated platform in request attributes
        request.setAttribute(AUTHENTICATED_PLATFORM_ATTR, platform);

        // Set in Spring Security context
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                platform.getName(),
                null,
                List.of(new SimpleGrantedAuthority("ROLE_PLATFORM"))
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorizedError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now().toString());
        errorDetails.put("status", HttpStatus.UNAUTHORIZED.value());
        errorDetails.put("error", "Unauthorized");
        errorDetails.put("message", message);

        response.getWriter().write(objectMapper.writeValueAsString(errorDetails));
    }
}

