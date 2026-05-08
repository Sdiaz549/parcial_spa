package com.serenity.frontend.dto;

import java.math.BigDecimal;

public record SpaServiceDto(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer durationMinutes,
        String imageUrl,
        Boolean active
) {
}
