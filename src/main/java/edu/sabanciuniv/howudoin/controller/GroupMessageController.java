package edu.sabanciuniv.howudoin.controller;

import edu.sabanciuniv.howudoin.model.GroupMessage;
import edu.sabanciuniv.howudoin.model.User;
import edu.sabanciuniv.howudoin.service.UserService;
import edu.sabanciuniv.howudoin.service.GroupMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/group-messages")
public class GroupMessageController {

    private final GroupMessageService groupMessageService;
    private final UserService userService;

    @Autowired
    public GroupMessageController(GroupMessageService groupMessageService, UserService userService) {
        this.groupMessageService = groupMessageService;
        this.userService = userService;
    }

    @PostMapping("/send/{groupId}")
    public GroupMessage sendGroupMessage(@PathVariable String groupId, @RequestBody GroupMessage groupMessage) {
        groupMessage.setGroupId(groupId); // Assign groupId to the message
        return groupMessageService.sendMessage(groupMessage);
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<?> getGroupMessages(@PathVariable String groupId) {
        List<GroupMessage> messages = groupMessageService.getMessagesByGroupId(groupId);
        List<Map<String, Object>> response = new ArrayList<>();

        for (GroupMessage message : messages) {
            User sender = userService.getUserById(message.getSender());
            Map<String, Object> messageWithSender = new HashMap<>();
            messageWithSender.put("sender", sender.getEmail());  // Fetch sender username
            messageWithSender.put("content", message.getContent());
            messageWithSender.put("timestamp", message.getTimestamp());  // Preserve timestamp
            response.add(messageWithSender);
        }
        return ResponseEntity.ok(response);
    }


}
