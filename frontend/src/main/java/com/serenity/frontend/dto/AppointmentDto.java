package com.serenity.frontend.dto;

public record AppointmentDto(
        Long id,
        String userEmail,
        Long serviceId,
        String serviceName,
        String appointmentDate,
        String appointmentTime,
        String status
) {
}
