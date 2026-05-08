package com.serenity.spa.repository;

import com.serenity.spa.domain.Appointment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserEmailOrderByAppointmentDateDescAppointmentTimeDesc(String userEmail);
}
