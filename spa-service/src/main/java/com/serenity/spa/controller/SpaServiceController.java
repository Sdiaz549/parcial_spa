package com.serenity.spa.controller;

import com.serenity.spa.domain.SpaService;
import com.serenity.spa.dto.SpaServiceRequest;
import com.serenity.spa.repository.SpaServiceRepository;
import jakarta.validation.Valid;
import java.util.Comparator;
import java.util.List;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/services")
public class SpaServiceController {

    private final SpaServiceRepository spaServiceRepository;

    public SpaServiceController(SpaServiceRepository spaServiceRepository) {
        this.spaServiceRepository = spaServiceRepository;
    }

    @GetMapping
    public List<SpaService> list() {
        return spaServiceRepository.findAll().stream()
                .sorted(Comparator.comparing(SpaService::getId))
                .toList();
    }

    @GetMapping("/{id}")
    public SpaService find(@PathVariable Long id) {
        return findService(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SpaService create(@Valid @RequestBody SpaServiceRequest request) {
        SpaService spaService = new SpaService();
        applyRequest(spaService, request);
        return spaServiceRepository.save(spaService);
    }

    @PutMapping("/{id}")
    public SpaService update(@PathVariable Long id, @Valid @RequestBody SpaServiceRequest request) {
        SpaService spaService = findService(id);
        applyRequest(spaService, request);
        return spaServiceRepository.save(spaService);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!spaServiceRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado");
        }
        spaServiceRepository.deleteById(id);
    }

    private SpaService findService(Long id) {
        return spaServiceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado"));
    }

    private void applyRequest(SpaService spaService, SpaServiceRequest request) {
        spaService.setName(request.name().trim());
        spaService.setDescription(request.description().trim());
        spaService.setPrice(request.price());
        spaService.setDurationMinutes(request.durationMinutes());
        spaService.setImageUrl(request.imageUrl() == null ? "" : request.imageUrl().trim());
        spaService.setActive(request.active() == null || request.active());
    }
}
