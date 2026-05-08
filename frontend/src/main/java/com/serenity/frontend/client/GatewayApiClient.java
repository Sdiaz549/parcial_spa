package com.serenity.frontend.client;

import com.serenity.frontend.dto.AppointmentDto;
import com.serenity.frontend.dto.AppointmentRequest;
import com.serenity.frontend.dto.AuthResponse;
import com.serenity.frontend.dto.LoginRequest;
import com.serenity.frontend.dto.RegisterRequest;
import com.serenity.frontend.dto.SpaServiceDto;
import com.serenity.frontend.dto.SpaServiceRequest;
import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClient;

@Component
public class GatewayApiClient {

    private final RestClient restClient;
    private final String gatewayUrl;

    public GatewayApiClient(RestClient restClient, @Value("${api.gateway.url}") String gatewayUrl) {
        this.restClient = restClient;
        this.gatewayUrl = gatewayUrl;
    }

    public AuthResponse register(RegisterRequest request) {
        return post("/auth/register", request, null, AuthResponse.class);
    }

    public AuthResponse login(LoginRequest request) {
        return post("/auth/login", request, null, AuthResponse.class);
    }

    public List<SpaServiceDto> services() {
        SpaServiceDto[] response = get("/services", null, SpaServiceDto[].class);
        return response == null ? List.of() : Arrays.asList(response);
    }

    public SpaServiceDto createService(String token, SpaServiceRequest request) {
        return post("/services", request, token, SpaServiceDto.class);
    }

    public SpaServiceDto updateService(String token, Long id, SpaServiceRequest request) {
        return put("/services/" + id, request, token, SpaServiceDto.class);
    }

    public void deleteService(String token, Long id) {
        delete("/services/" + id, token);
    }

    public AppointmentDto createAppointment(String token, AppointmentRequest request) {
        return post("/appointments", request, token, AppointmentDto.class);
    }

    public List<AppointmentDto> myAppointments(String token) {
        return get("/appointments/my", token, new ParameterizedTypeReference<>() {
        });
    }

    public List<AppointmentDto> allAppointments(String token) {
        return get("/appointments", token, new ParameterizedTypeReference<>() {
        });
    }

    public AppointmentDto updateAppointmentStatus(String token, Long id, String status) {
        return put("/appointments/" + id + "/status", new StatusRequest(status), token, AppointmentDto.class);
    }

    public void deleteAppointment(String token, Long id) {
        delete("/appointments/" + id, token);
    }

    private <T> T get(String path, String token, Class<T> responseType) {
        try {
            return restClient.get()
                    .uri(gatewayUrl + path)
                    .headers(headers -> applyHeaders(headers, token))
                    .retrieve()
                    .body(responseType);
        } catch (HttpStatusCodeException ex) {
            throw new RuntimeException(ex.getResponseBodyAsString());
        }
    }

    private <T> T get(String path, String token, ParameterizedTypeReference<T> responseType) {
        try {
            return restClient.get()
                    .uri(gatewayUrl + path)
                    .headers(headers -> applyHeaders(headers, token))
                    .retrieve()
                    .body(responseType);
        } catch (HttpStatusCodeException ex) {
            throw new RuntimeException(ex.getResponseBodyAsString());
        }
    }

    private <B, T> T post(String path, B body, String token, Class<T> responseType) {
        try {
            return restClient.post()
                    .uri(gatewayUrl + path)
                    .headers(headers -> applyHeaders(headers, token))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(responseType);
        } catch (HttpStatusCodeException ex) {
            throw new RuntimeException(ex.getResponseBodyAsString());
        }
    }

    private <B, T> T put(String path, B body, String token, Class<T> responseType) {
        try {
            return restClient.put()
                    .uri(gatewayUrl + path)
                    .headers(headers -> applyHeaders(headers, token))
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(responseType);
        } catch (HttpStatusCodeException ex) {
            throw new RuntimeException(ex.getResponseBodyAsString());
        }
    }

    private void delete(String path, String token) {
        try {
            restClient.delete()
                    .uri(gatewayUrl + path)
                    .headers(headers -> applyHeaders(headers, token))
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpStatusCodeException ex) {
            throw new RuntimeException(ex.getResponseBodyAsString());
        }
    }

    private void applyHeaders(HttpHeaders headers, String token) {
        if (token != null && !token.isBlank()) {
            headers.setBearerAuth(token);
        }
    }

    private record StatusRequest(String status) {
    }
}
