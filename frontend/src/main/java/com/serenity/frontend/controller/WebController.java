package com.serenity.frontend.controller;

import com.serenity.frontend.client.GatewayApiClient;
import com.serenity.frontend.dto.AppointmentRequest;
import com.serenity.frontend.dto.AuthResponse;
import com.serenity.frontend.dto.LoginRequest;
import com.serenity.frontend.dto.RegisterRequest;
import com.serenity.frontend.dto.SpaServiceRequest;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class WebController {

    private final GatewayApiClient apiClient;

    public WebController(GatewayApiClient apiClient) {
        this.apiClient = apiClient;
    }

    @GetMapping("/")
    public String home(Model model, HttpSession session) {
        injectSession(model, session);
        model.addAttribute("services", apiClient.services());
        return "home";
    }

    @GetMapping("/login")
    public String login(Model model) {
        model.addAttribute("error", "");
        return "login";
    }

    @PostMapping("/login")
    public String doLogin(@RequestParam String email, @RequestParam String password, HttpSession session, Model model) {
        try {
            AuthResponse auth = apiClient.login(new LoginRequest(email, password));
            saveSession(auth, session);
            return "redirect:/dashboard";
        } catch (RuntimeException ex) {
            model.addAttribute("error", "Credenciales invalidas");
            return "login";
        }
    }

    @GetMapping("/register")
    public String register(Model model) {
        model.addAttribute("error", "");
        return "register";
    }

    @PostMapping("/register")
    public String doRegister(@RequestParam String name, @RequestParam String email, @RequestParam String password, HttpSession session, Model model) {
        try {
            AuthResponse auth = apiClient.register(new RegisterRequest(name, email, password, "USER"));
            saveSession(auth, session);
            return "redirect:/dashboard";
        } catch (RuntimeException ex) {
            model.addAttribute("error", "No se pudo registrar el usuario");
            return "register";
        }
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session) {
        if (!isAuthenticated(session)) return "redirect:/login";
        return "ADMIN".equals(role(session)) ? "redirect:/admin/services" : "redirect:/my-appointments";
    }

    @GetMapping("/services")
    public String services(Model model, HttpSession session) {
        injectSession(model, session);
        model.addAttribute("services", apiClient.services());
        return "services";
    }

    @GetMapping("/book")
    public String book(Model model, HttpSession session) {
        if (!isAuthenticated(session)) return "redirect:/login";
        injectSession(model, session);
        model.addAttribute("services", apiClient.services());
        return "book";
    }

    @PostMapping("/book")
    public String createAppointment(
            @RequestParam Long serviceId,
            @RequestParam String appointmentDate,
            @RequestParam String appointmentTime,
            HttpSession session
    ) {
        if (!isAuthenticated(session)) return "redirect:/login";
        apiClient.createAppointment(token(session), new AppointmentRequest(serviceId, appointmentDate, appointmentTime));
        return "redirect:/my-appointments";
    }

    @GetMapping("/my-appointments")
    public String myAppointments(Model model, HttpSession session) {
        if (!isAuthenticated(session)) return "redirect:/login";
        injectSession(model, session);
        model.addAttribute("appointments", apiClient.myAppointments(token(session)));
        return "my-appointments";
    }

    @PostMapping("/appointments/delete/{id}")
    public String deleteAppointment(@PathVariable Long id, HttpSession session) {
        if (!isAuthenticated(session)) return "redirect:/login";
        apiClient.deleteAppointment(token(session), id);
        return "redirect:/my-appointments";
    }

    @GetMapping("/admin/services")
    public String adminServices(Model model, HttpSession session) {
        if (!isAdmin(session)) return "redirect:/dashboard";
        injectSession(model, session);
        model.addAttribute("services", apiClient.services());
        return "admin-services";
    }

    @PostMapping("/admin/services")
    public String createService(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam Integer durationMinutes,
            @RequestParam String imageUrl,
            @RequestParam(defaultValue = "true") Boolean active,
            HttpSession session
    ) {
        if (!isAdmin(session)) return "redirect:/dashboard";
        apiClient.createService(token(session), new SpaServiceRequest(name, description, price, durationMinutes, imageUrl, active));
        return "redirect:/admin/services";
    }

    @PostMapping("/admin/services/delete/{id}")
    public String deleteService(@PathVariable Long id, HttpSession session) {
        if (!isAdmin(session)) return "redirect:/dashboard";
        apiClient.deleteService(token(session), id);
        return "redirect:/admin/services";
    }

    @GetMapping("/admin/appointments")
    public String adminAppointments(Model model, HttpSession session) {
        if (!isAdmin(session)) return "redirect:/dashboard";
        injectSession(model, session);
        model.addAttribute("appointments", apiClient.allAppointments(token(session)));
        return "admin-appointments";
    }

    @PostMapping("/admin/appointments/status/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam String status, HttpSession session) {
        if (!isAdmin(session)) return "redirect:/dashboard";
        apiClient.updateAppointmentStatus(token(session), id, status);
        return "redirect:/admin/appointments";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    private void saveSession(AuthResponse auth, HttpSession session) {
        session.setAttribute("token", auth.token());
        session.setAttribute("role", auth.role());
        session.setAttribute("email", auth.email());
        session.setAttribute("name", auth.name());
    }

    private void injectSession(Model model, HttpSession session) {
        model.addAttribute("loggedIn", isAuthenticated(session));
        model.addAttribute("role", role(session));
        model.addAttribute("name", session.getAttribute("name"));
    }

    private boolean isAuthenticated(HttpSession session) {
        return session.getAttribute("token") != null;
    }

    private boolean isAdmin(HttpSession session) {
        return "ADMIN".equals(role(session));
    }

    private String role(HttpSession session) {
        Object role = session.getAttribute("role");
        return role == null ? "" : role.toString();
    }

    private String token(HttpSession session) {
        Object token = session.getAttribute("token");
        return token == null ? "" : token.toString();
    }
}
