package com.serenity.auth.controller;

import com.serenity.auth.domain.AppUser;
import com.serenity.auth.domain.Role;
import com.serenity.auth.dto.AuthResponse;
import com.serenity.auth.dto.LoginRequest;
import com.serenity.auth.dto.RegisterRequest;
import com.serenity.auth.repository.UserRepository;
import com.serenity.auth.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya esta registrado");
        }

        AppUser user = new AppUser();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(resolveRole(request.role()));

        AppUser savedUser = userRepository.save(user);
        return responseWithToken(savedUser);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        AppUser user = userRepository.findByEmail(request.email().trim().toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas");
        }

        return responseWithToken(user);
    }

    @GetMapping("/me")
    public AuthResponse me(Authentication authentication) {
        String email = authentication.getName();
        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        return new AuthResponse(null, user.getRole().name(), user.getEmail(), user.getName());
    }

    private AuthResponse responseWithToken(AppUser user) {
        return new AuthResponse(jwtService.generateToken(user), user.getRole().name(), user.getEmail(), user.getName());
    }

    private Role resolveRole(String role) {
        if (role == null || role.isBlank()) {
            return Role.USER;
        }
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol invalido. Use ADMIN o USER");
        }
    }
}
