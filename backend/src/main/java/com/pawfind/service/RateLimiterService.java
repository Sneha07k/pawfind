package com.pawfind.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimiterService {

    private final ConcurrentHashMap<String, Instant> lastRequestByEmail = new ConcurrentHashMap<>();
    private static final long COOLDOWN_SECONDS = 60;

    /**
     * Returns true if the request is allowed (and records it); false if still in
     * cooldown.
     */
    public boolean allow(String email) {
        Instant now = Instant.now();
        Instant last = lastRequestByEmail.get(email);

        if (last != null && now.isBefore(last.plusSeconds(COOLDOWN_SECONDS))) {
            return false;
        }
        lastRequestByEmail.put(email, now);
        return true;
    }
}