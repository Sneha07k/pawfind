package com.pawfind.config;

import com.pawfind.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final UserRepository userRepository;

    // Runs once a day at 3 AM server time
    @Scheduled(cron = "0 0 3 * * *")
    public void purgeAbandonedUnverifiedAccounts() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(48);
        var abandoned = userRepository.findAll().stream()
                .filter(u -> !u.isVerified() && u.getCreatedAt().isBefore(cutoff))
                .toList();

        if (!abandoned.isEmpty()) {
            userRepository.deleteAll(abandoned);
            log.info("Purged {} abandoned unverified accounts older than 48 hours", abandoned.size());
        }
    }
}