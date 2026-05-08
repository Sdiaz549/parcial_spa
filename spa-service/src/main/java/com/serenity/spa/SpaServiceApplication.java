package com.serenity.spa;

import com.serenity.spa.domain.SpaService;
import com.serenity.spa.repository.SpaServiceRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpaServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpaServiceApplication.class, args);
    }

    @Bean
    CommandLineRunner seedServices(SpaServiceRepository spaServiceRepository) {
        return args -> {
            if (spaServiceRepository.count() > 0) {
                return;
            }

            spaServiceRepository.saveAll(List.of(
                    service("Masaje Relajante", "Masaje corporal antiestrés con aceites botánicos y presión personalizada.", "85.00", 60, "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80"),
                    service("Limpieza Facial", "Ritual facial profundo con vapor, exfoliación suave, mascarilla nutritiva e hidratación.", "65.00", 45, "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80"),
                    service("Aromaterapia", "Experiencia sensorial con aceites esenciales, respiración guiada y descanso reparador.", "58.00", 40, "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80"),
                    service("Piedras Calientes", "Terapia de calor profundo con piedras volcánicas para liberar tensión muscular.", "95.00", 75, "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80"),
                    service("Manicure Spa", "Cuidado premium de manos con exfoliación, masaje, hidratación y esmaltado.", "42.00", 35, "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=80")
            ));
        };
    }

    private SpaService service(String name, String description, String price, int duration, String imageUrl) {
        SpaService spaService = new SpaService();
        spaService.setName(name);
        spaService.setDescription(description);
        spaService.setPrice(new BigDecimal(price));
        spaService.setDurationMinutes(duration);
        spaService.setImageUrl(imageUrl);
        spaService.setActive(true);
        return spaService;
    }
}
