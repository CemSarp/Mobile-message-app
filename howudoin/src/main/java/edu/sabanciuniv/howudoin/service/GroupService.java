package edu.sabanciuniv.howudoin.service;

import edu.sabanciuniv.howudoin.model.Group;
import edu.sabanciuniv.howudoin.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.time.LocalDateTime;
import java.util.List;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserService userService;

    private static final Logger log = LoggerFactory.getLogger(GroupService.class);


    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Group getGroupById(String id) {
        return groupRepository.findById(id).orElseThrow();
    }

    public List<Group> findGroupsByUserId(String userId) {
        return groupRepository.findByMembersContaining(userId);
    }

    public Group createGroup(Group group) {
        if (group.getCreatedAt() == null) {
            group.setCreatedAt(LocalDateTime.now());  // Set at the time of creation
        }
        return groupRepository.save(group);
    }



    public Group findById(String groupId) {
        Group group = groupRepository.findById(groupId).orElse(null);
        if (group != null) {
            List<String> memberIds = group.getMembers();
            log.info("Fetching usernames for member IDs: {}", memberIds);

            List<String> memberUsernames = userService.findUsernamesByIds(memberIds);
            log.info("Fetched usernames: {}", memberUsernames);

            group.setMemberNames(memberUsernames);
        }
        return group;
    }


}
