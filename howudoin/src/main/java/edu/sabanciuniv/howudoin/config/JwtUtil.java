package edu.sabanciuniv.howudoin.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

import edu.sabanciuniv.howudoin.model.User;

@Component
public class JwtUtil {

    private final SecretKeySpec secretKey;
    private final long expirationTime;
    private final long refreshExpirationTime;  // Refresh token expiration

    public JwtUtil(@Value("${jwt.secret}") String plainTextSecret,
                   @Value("${jwt.expiration:86400000}") long expirationTime,
                   @Value("${jwt.refresh.expiration:604800000}") long refreshExpirationTime) {
        if (plainTextSecret.length() < 32) {
            throw new IllegalArgumentException("JWT secret key must be at least 32 characters long.");
        }
        this.secretKey = new SecretKeySpec(plainTextSecret.getBytes(), SignatureAlgorithm.HS256.getJcaName());
        this.expirationTime = expirationTime;
        this.refreshExpirationTime = refreshExpirationTime;
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(secretKey)
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationTime))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean validateToken(String token, User userDetails) {
        final String email = extractEmail(token);
        return email.equals(userDetails.getEmail()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    public String refreshAccessToken(String refreshToken) {
        Claims claims = extractAllClaims(refreshToken);
        if (isTokenExpired(refreshToken)) {
            throw new IllegalStateException("Refresh token expired.");
        }
        return generateToken(claims.getSubject());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
