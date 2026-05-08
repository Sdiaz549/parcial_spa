package com.serenity.spa.dto;

import com.serenity.spa.domain.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(
        @NotNull AppointmentStatus status
) {
}
