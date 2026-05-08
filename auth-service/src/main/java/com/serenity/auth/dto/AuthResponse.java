package com.serenity.auth.dto;

public record AuthResponse(
        String token,
        String role,
        String email,
        String name
) {
}
