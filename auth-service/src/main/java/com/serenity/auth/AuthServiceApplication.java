package com.serenity.auth;

import com.serenity.auth.domain.AppUser;
import com.serenity.auth.domain.Role;
import com.serenity.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createUserIfAbsent(userRepository, passwordEncoder, "Administrador Serenity", "admin@spa.com", "admin123", Role.ADMIN);
            createUserIfAbsent(userRepository, passwordEncoder, "Cliente Serenity", "user@spa.com", "user123", Role.USER);
        };
    }

    private void createUserIfAbsent(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            String name,
            String email,
            String password,
            Role role
    ) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        AppUser user = new AppUser();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        userRepository.save(user);
    }
}
