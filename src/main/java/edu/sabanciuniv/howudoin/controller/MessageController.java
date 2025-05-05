package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.Message;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.service.MessageService;
import edu.sabanciuniv.howudoin.service.UserService;
import edu.sabanciuniv.howudoin.websocket.ChatWebSocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserService userService;

    public MessageController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }


    @PostMapping("/send")
    public Message sendDirectMessage(@RequestBody Message message) {
        return messageService.sendMessage(message);
    }



    @GetMapping("/direct/{recipientId}")
    public List<Message> getDirectMessages(@PathVariable String recipientId) {
        return messageService.getDirectMessages(recipientId);
    }


    @GetMapping("/conversation/{userId}/{friendId}")
    public ResponseEntity<?> getConversation(@PathVariable String userId, @PathVariable String friendId) {
        if (userId == null || friendId == null || "undefined".equals(friendId)) {
            return ResponseEntity.badRequest().body("Invalid recipient ID");
        }

        List<Message> messages = messageService.getConversationHistory(userId, friendId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Message message : messages) {
            User sender = userService.getUserById(message.getSender());
            Map<String, Object> messageWithSender = new HashMap<>();
            messageWithSender.put("sender", sender.getEmail());  // Fetch username
            messageWithSender.put("content", message.getContent());
            messageWithSender.put("timestamp", message.getTimestamp());  // Keep timestamp as Date
            response.add(messageWithSender);
        }
        return ResponseEntity.ok(response);
    }


    /*
    @Autowired
    private ChatWebSocketHandler webSocketHandler;  // Add WebSocket handler

    @PostMapping("/send")
    public Message sendDirectMessage(@RequestBody Message message) {
        Message savedMessage = messageService.sendMessage(message);

        try {
            // Broadcast message to all connected clients
            String payload = String.format(
                    "{\"sender\": \"%s\", \"content\": \"%s\", \"timestamp\": \"%s\"}",
                    message.getSender(), message.getContent(), message.getTimestamp().toString()
            );
            webSocketHandler.sendMessageToAll(payload);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return savedMessage;
    }
     */

}
