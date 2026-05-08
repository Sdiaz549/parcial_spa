package com.serenity.frontend.dto;

public record AuthResponse(
        String token,
        String role,
        String email,
        String name
) {
}
