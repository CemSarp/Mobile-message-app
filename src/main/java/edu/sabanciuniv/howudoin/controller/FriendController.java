package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.FriendRequest;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.service.FriendService;
import edu.sabanciuniv.howudoin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {
    @Autowired
    private FriendService friendService;
    private final UserService userService;

    public FriendController(UserService userService) {
        this.userService = userService;
    }

    // Send Friend Request
    @PostMapping("/add")
    public FriendRequest sendFriendRequest(@RequestBody FriendRequest request) {
        if (request.getSenderId() == null || request.getReceiverId() == null) {
            throw new IllegalArgumentException("Sender and Receiver must be provided.");
        }
        return friendService.sendFriendRequest(request);
    }

    // Fetch Pending Requests (Separate from Accepted Friends)
    @GetMapping("/requests/{userId}")
    public List<FriendRequest> getPendingRequests(@PathVariable String userId) {
        return friendService.getPendingRequests(userId);
    }

    // Accept or Reject Friend Request
    @PutMapping("/request/{id}")
    public FriendRequest updateFriendRequestStatus(@PathVariable String id, @RequestParam String status) {
        return friendService.updateFriendRequestStatus(id, status);
    }

    @GetMapping("/list/{userId}")
    public ResponseEntity<List<User>> getFriends(@PathVariable String userId) {
        List<User> friends = friendService.getFriends(userId);
        return ResponseEntity.ok(friends);
    }

    @GetMapping("/details/{friendId}")
    public ResponseEntity<?> getFriendDetails(@PathVariable String friendId) {
        User friend = userService.getUserById(friendId);
        if (friend != null) {
            return ResponseEntity.ok(friend);
        }
        return ResponseEntity.badRequest().body("Friend not found");
    }


}
