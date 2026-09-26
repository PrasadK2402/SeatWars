package com.pasara.backend.config;

import com.pasara.backend.Model.AppUser;
import com.pasara.backend.Model.Role;
import com.pasara.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@pasara.com";

            if (!userRepository.existsByEmail(adminEmail)) {

                AppUser admin = new AppUser();

                admin.setName("Pasara Admin");
                admin.setEmail(adminEmail);

                admin.setPassword(
                        passwordEncoder.encode("admin123")
                );

                admin.setRole(Role.ADMIN);

                userRepository.save(admin);

                System.out.println(
                        "Default admin created: " + adminEmail
                );
            }
        };
    }
}