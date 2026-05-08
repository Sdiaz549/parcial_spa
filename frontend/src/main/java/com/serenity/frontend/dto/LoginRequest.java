package com.serenity.frontend.dto;

public record LoginRequest(
        String email,
        String password
) {
}
