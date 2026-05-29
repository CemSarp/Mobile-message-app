package edu.sabanciuniv.howudoin.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "messages")
public class Message {
    // Getters and Setters
    @Getter
    @Setter
    @Id
    private String id;
    @Getter
    @Setter
    private String sender;
    @Getter
    @Setter  // Add this to allow proper setting of recipient
    private String recipient;
    @Setter
    @Getter
    private String content;
    private boolean isGroupMessage; // True for group messages, false for direct messages
    @Setter
    @Getter
    private Date timestamp;

    // Default Constructor
    public Message() {
        this.timestamp = new Date(); // Automatically set timestamp
    }

    // Parameterized Constructor
    public Message(String sender, String recipient, String content, boolean isGroupMessage) {
        this.sender = sender;
        this.recipient = recipient;
        this.content = content;
        this.isGroupMessage = isGroupMessage;
        this.timestamp = new Date(); // Automatically set timestamp
    }

    public boolean isGroupMessage() {
        return isGroupMessage;
    }

    public void setGroupMessage(boolean groupMessage) {
        isGroupMessage = groupMessage;
    }

}
