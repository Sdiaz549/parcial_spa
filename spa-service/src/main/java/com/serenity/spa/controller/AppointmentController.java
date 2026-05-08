package com.serenity.spa.controller;

import com.serenity.spa.domain.Appointment;
import com.serenity.spa.domain.AppointmentStatus;
import com.serenity.spa.domain.SpaService;
import com.serenity.spa.dto.AppointmentRequest;
import com.serenity.spa.dto.StatusUpdateRequest;
import com.serenity.spa.repository.AppointmentRepository;
import com.serenity.spa.repository.SpaServiceRepository;
import jakarta.validation.Valid;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final SpaServiceRepository spaServiceRepository;

    public AppointmentController(AppointmentRepository appointmentRepository, SpaServiceRepository spaServiceRepository) {
        this.appointmentRepository = appointmentRepository;
        this.spaServiceRepository = spaServiceRepository;
    }

    @GetMapping
    public List<Appointment> listAll() {
        return appointmentRepository.findAll().stream()
                .sorted(Comparator.comparing(Appointment::getAppointmentDate).reversed()
                        .thenComparing(Comparator.comparing(Appointment::getAppointmentTime).reversed()))
                .toList();
    }

    @GetMapping("/my")
    public List<Appointment> myAppointments(Authentication authentication) {
        return appointmentRepository.findByUserEmailOrderByAppointmentDateDescAppointmentTimeDesc(authentication.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment create(@Valid @RequestBody AppointmentRequest request, Authentication authentication) {
        SpaService spaService = spaServiceRepository.findById(request.serviceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado"));

        if (!Boolean.TRUE.equals(spaService.getActive())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El servicio no esta activo");
        }

        Appointment appointment = new Appointment();
        appointment.setUserEmail(authentication.getName());
        appointment.setServiceId(spaService.getId());
        appointment.setServiceName(spaService.getName());
        appointment.setAppointmentDate(request.appointmentDate());
        appointment.setAppointmentTime(request.appointmentTime());
        appointment.setStatus(AppointmentStatus.PENDING);
        return appointmentRepository.save(appointment);
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        Appointment appointment = findAppointment(id);
        appointment.setStatus(request.status());
        return appointmentRepository.save(appointment);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Appointment appointment = findAppointment(id);
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && !appointment.getUserEmail().equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No puedes eliminar esta reserva");
        }

        appointmentRepository.delete(appointment);
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));
    }
}
