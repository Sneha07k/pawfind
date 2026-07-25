package com.pawfind;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PawfindApplication {

    public static void main(String[] args) {
        SpringApplication.run(PawfindApplication.class, args);
    }
}