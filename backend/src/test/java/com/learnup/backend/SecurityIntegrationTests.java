package com.learnup.backend;

import com.learnup.backend.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import com.learnup.backend.repository.UserRepository;
import com.learnup.backend.entity.User;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTests {
    @Autowired MockMvc mockMvc;
    @Autowired JwtService jwtService;
    @MockitoBean UserRepository userRepository;

    @Test
    void publicEndpointDoesNotRequireToken() throws Exception {
        mockMvc.perform(get("/api/hello")).andExpect(status().isOk());
    }

    @Test
    void privateEndpointRejectsMissingToken() throws Exception {
        mockMvc.perform(get("/api/users")).andExpect(status().isUnauthorized());
    }

    @Test
    void adminEndpointRejectsStudentRole() throws Exception {
        User student = new User(); student.setId(10L); student.setEmail("student@test.local"); student.setRole("student");
        when(userRepository.findById(10L)).thenReturn(Optional.of(student));
        String token = jwtService.createToken(10L, "student@test.local", "student");
        mockMvc.perform(get("/api/revenue/admin").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    void tamperedTokenIsRejected() throws Exception {
        String token = jwtService.createToken(10L, "student@test.local", "student");
        String tampered = token.substring(0, token.length() - 1) + (token.endsWith("a") ? "b" : "a");
        mockMvc.perform(get("/api/users").header("Authorization", "Bearer " + tampered))
                .andExpect(status().isUnauthorized());
    }
}
