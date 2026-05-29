package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.config.JwtUtil;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.service.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private CustomUserDetailsService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        userService.register(user);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> request) {
        try {
            String email    = request.get("email");
            String password = request.get("password");

            String token = userService.login(email, password);   // may now throw BadCredentialsException
            User   user  = userService.loadUserByEmail(email);

            return ResponseEntity.ok(Map.of(
                    "accessToken",  token,
                    "refreshToken", jwtUtil.generateRefreshToken(email),
                    "userId",       user.getId()
            ));

        } catch (BadCredentialsException ex) {          // <‑‑ catches the new exception
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "code",    "INVALID_CREDENTIALS",
                            "message", "Incorrect email or password."
                    ));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "code",    "SERVER_ERROR",
                            "message", "Server error, please try again later."
                    ));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (jwtUtil.isTokenExpired(refreshToken)) {
            throw new IllegalStateException("Refresh token expired.");
        }

        String email = jwtUtil.extractEmail(refreshToken);
        String newAccessToken = jwtUtil.generateToken(email);

        return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    }
}
