package edu.sabanciuniv.howudoin.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "groups")
public class Group {

    @Id
    private String id;
    private String name;
    private List<String> members;
    private List<String> memberNames;
    private String createdBy;
    private LocalDateTime createdAt;  // New field for creation time

    // Getters and Setters
    public Group() {
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }

    public List<String> getMemberNames() {
        return memberNames;
    }

    public void setMemberNames(List<String> memberNames) {
        this.memberNames = memberNames;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
