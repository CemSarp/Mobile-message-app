package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Load a user by email for JWT validation.
     */
    public User loadUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public List<String> findUsernamesByIds(List<String> userIds) {
        return userRepository.findAllById(userIds).stream()
                .map(User::getEmail)  // Assuming email is used as username
                .collect(Collectors.toList());
    }


    public String findUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(User::getId)  // Extract user ID
                .orElse(null);     // Return null if not found
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
    }

}
