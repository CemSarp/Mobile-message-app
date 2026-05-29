package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.repository.MessageRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message sendMessage(Message message) {
        message.setTimestamp(new Date());
        return messageRepository.save(message);
    }

    public List<Message> getDirectMessages(String recipient) {
        return messageRepository.findByRecipient(recipient);
    }

    public List<Message> getConversationHistory(String user1, String user2) {
        return messageRepository.findConversationHistory(user1, user2, Sort.by(Sort.Direction.ASC, "timestamp"));
    }

}
