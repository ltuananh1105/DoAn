package com.learnup.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import com.learnup.backend.repository.UserRepository;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserRepository userRepository;
    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService; this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            Map<String, Object> claims = jwtService.verify(authorization.substring(7));
            if (claims != null) {
                Object idValue = claims.get("userId");
                Long userId = idValue instanceof Number number ? number.longValue() : null;
                var user = userId == null ? java.util.Optional.<com.learnup.backend.entity.User>empty()
                        : userRepository.findById(userId);
                String tokenRole = String.valueOf(claims.get("role"));
                String tokenEmail = String.valueOf(claims.get("sub"));
                if (user.isPresent() && tokenRole.equalsIgnoreCase(user.get().getRole())
                        && tokenEmail.equalsIgnoreCase(user.get().getEmail())) {
                    String role = user.get().getRole().toUpperCase();
                    var authentication = new UsernamePasswordAuthenticationToken(claims, null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role)));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }
        chain.doFilter(request, response);
    }
}
