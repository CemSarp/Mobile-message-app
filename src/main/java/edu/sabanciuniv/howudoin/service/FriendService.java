package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.FriendRequest;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.repository.FriendRequestRepository;
import edu.sabanciuniv.howudoin.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

import java.util.List;
import java.util.stream.Stream;

@Service
public class FriendService {
    private final FriendRequestRepository friendRequestRepository;
    private final UserRepository userRepository;

    public FriendService(FriendRequestRepository friendRequestRepository, UserRepository userRepository) {
        this.friendRequestRepository = friendRequestRepository;
        this.userRepository = userRepository;
    }

    // Send Friend Request with Validation
    public FriendRequest sendFriendRequest(FriendRequest request) {
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found."));
        User receiver = userRepository.findByEmail(request.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver does not exist."));

        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot send a friend request to yourself.");
        }

        friendRequestRepository.findBySenderIdAndReceiverId(sender.getId(), receiver.getId())
                .ifPresent(existingRequest -> {
                    throw new IllegalArgumentException("You have already sent a friend request to this user.");
                });

        request.setSenderUsername(sender.getEmail());
        request.setReceiverUsername(receiver.getEmail());
        request.setReceiverId(receiver.getId());
        request.setStatus("PENDING");

        return friendRequestRepository.save(request);
    }

    // Get Pending Requests (Exclude Accepted)
    public List<FriendRequest> getPendingRequests(String userId) {
        return friendRequestRepository.findByReceiverIdAndStatus(userId, "PENDING");
    }


    public List<User> getFriends(String userId) {
        List<FriendRequest> acceptedRequests = friendRequestRepository.findAcceptedFriends(userId);

        Set<String> friendIds = acceptedRequests.stream()
                .flatMap(req -> Stream.of(req.getSenderId(), req.getReceiverId()))
                .filter(id -> !id.equals(userId))
                .collect(Collectors.toSet());

        if (friendIds.isEmpty()) {
            return List.of();
        }

        // Fetch user details
        return userRepository.findAllById(friendIds);
    }





    public FriendRequest updateFriendRequestStatus(String requestId, String status) {
        FriendRequest request = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        request.setStatus(status);

        // If accepted, create mutual relationship (optional)
        if ("ACCEPTED".equals(status)) {
            FriendRequest reverseRequest = new FriendRequest();
            reverseRequest.setSenderId(request.getReceiverId());
            reverseRequest.setReceiverId(request.getSenderId());
            reverseRequest.setStatus("ACCEPTED");
            friendRequestRepository.save(reverseRequest);
        }
        return friendRequestRepository.save(request);
    }



}
