package com.learnup.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class SqlSeedPasswordTests {
    private static final String SQL_SEED_PASSWORD_HASH = "$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2";

    @Test
    void sqlSeedAccountsUseDemoPassword123456() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        assertTrue(encoder.matches("123456", SQL_SEED_PASSWORD_HASH));
    }
}
