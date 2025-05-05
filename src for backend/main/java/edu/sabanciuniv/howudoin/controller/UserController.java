package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
