package com.learnup.backend;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SqlSeedPasswordTests {
    private static final String SQL_SEED_PASSWORD_HASH = "$2a$10$2gYfQrr6anokDjvVCN6A7uSOln5uDP41pyrUqLI6Kk/QJJb9MRoU2";

    @Test
    void sqlSeedAccountsUseDemoPassword123456() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        assertTrue(encoder.matches("123456", SQL_SEED_PASSWORD_HASH));
    }

    @Test
    void singleSqlFileContainsSeedAndNoDestructiveStatements() throws Exception {
        String sql = Files.readString(Path.of("..", "SQLQuery1.sql"));
        assertTrue(sql.contains(SQL_SEED_PASSWORD_HASH));
        String normalized = sql.toUpperCase();
        assertFalse(normalized.contains("DELETE FROM"));
        assertFalse(normalized.contains("DROP TABLE"));
        assertFalse(normalized.contains("TRUNCATE TABLE"));
    }
}
