package edu.sabanciuniv.howudoin.repository;

import edu.sabanciuniv.howudoin.model.FriendRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;
import java.util.List;

public interface FriendRequestRepository extends MongoRepository<FriendRequest, String> {
    List<FriendRequest> findByReceiverIdAndStatus(String receiverId, String status);
    List<FriendRequest> findBySenderIdAndStatus(String senderId, String status);
    List<FriendRequest> findByReceiverIdOrSenderId(String receiverId, String senderId);
    List<FriendRequest> findByReceiverIdOrSenderIdAndStatus(String receiverId, String senderId, String status);

    // New method to check existing friend requests
    Optional<FriendRequest> findBySenderIdAndReceiverId(String senderId, String receiverId);


    @Query("{ '$or': [ { 'senderId': ?0, 'status': 'ACCEPTED' }, { 'receiverId': ?0, 'status': 'ACCEPTED' } ] }")
    List<FriendRequest> findAcceptedFriends(String userId);


}
