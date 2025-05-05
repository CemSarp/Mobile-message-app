package edu.sabanciuniv.howudoin.repository;

import edu.sabanciuniv.howudoin.model.Message;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByRecipient(String recipient);

    @Query("{ $or: [ { $and: [ { sender: ?0 }, { recipient: ?1 } ] }, { $and: [ { sender: ?1 }, { recipient: ?0 } ] } ] }")
    List<Message> findConversationHistory(String user1, String user2, Sort sort);

}

