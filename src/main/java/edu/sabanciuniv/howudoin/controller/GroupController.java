package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.service.GroupService;

import edu.sabanciuniv.howudoin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;


import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;
    private final UserService userService;

    @Autowired
    public GroupController(GroupService groupService, UserService userService) {
        this.groupService = groupService;
        this.userService = userService;
    }

    private static final Logger log = LoggerFactory.getLogger(GroupController.class);

    @PostMapping("/create")
    public Group createGroup(@RequestBody Group group) {
        return groupService.createGroup(group); // Ensure this returns the saved object
    }

    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<Group>> getUserGroups(@PathVariable String userId) {
        List<Group> groups = groupService.findGroupsByUserId(userId);
        if (groups.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(groups);
    }


    @GetMapping("/details/{groupId}")
    public ResponseEntity<?> getGroupDetails(@PathVariable String groupId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        String email = null;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();  // Get email or username
        } else if (principal instanceof User) {
            email = ((User) principal).getEmail();  // Directly fetch email if User object
        } else {
            email = principal.toString();
        }

        log.info("Fetching group details for ID: {} by user: {}", groupId, email);

        Group group = groupService.findById(groupId);
        if (group == null) {
            log.warn("Group not found for ID: {}", groupId);
            return ResponseEntity.notFound().build();
        }

        // Fetch user ID by email
        String userId = userService.findUserIdByEmail(email);
        if (userId == null || !group.getMembers().contains(userId)) {
            log.warn("User {} not authorized to view group: {}", email, groupId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Ensure creation time is set and returned
        if (group.getCreatedAt() == null) {
            group.setCreatedAt(LocalDateTime.now());  // Default to now if missing
        }

        return ResponseEntity.ok(group);
    }




}

