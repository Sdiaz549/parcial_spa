package com.serenity.frontend.dto;

public record AppointmentRequest(
        Long serviceId,
        String appointmentDate,
        String appointmentTime
) {
}
