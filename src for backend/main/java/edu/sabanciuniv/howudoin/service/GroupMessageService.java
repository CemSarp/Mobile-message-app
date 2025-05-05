package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.model.GroupMessage;
import edu.sabanciuniv.howudoin.repository.GroupMessageRepository;
import edu.sabanciuniv.howudoin.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class GroupMessageService {

    private final GroupMessageRepository groupMessageRepository;

    @Autowired
    public GroupMessageService(GroupMessageRepository groupMessageRepository) {
        this.groupMessageRepository = groupMessageRepository;
    }

    public GroupMessage sendMessage(GroupMessage groupMessage) {
        // Log details
        System.out.println("Sending message to group: " + groupMessage.getGroupId());
        System.out.println("Sender: " + groupMessage.getSender());

        groupMessage.setTimestamp(new Date()); // Assign current timestamp
        return groupMessageRepository.save(groupMessage);
    }


    public List<GroupMessage> getMessagesByGroupId(String groupId) {
        return groupMessageRepository.findByGroupId(groupId);
    }
}
