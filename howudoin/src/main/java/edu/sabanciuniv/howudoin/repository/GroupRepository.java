package edu.sabanciuniv.howudoin.repository;

import edu.sabanciuniv.howudoin.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {

    List<Group> findByMembersContaining(String userId);
}
