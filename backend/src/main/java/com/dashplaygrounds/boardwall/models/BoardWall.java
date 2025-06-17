package com.dashplaygrounds.boardwall.models;

import java.time.ZonedDateTime;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@Table(name = "boardwalls")
@Entity
public class BoardWall {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    private String name;
    private List<String> sharedAccounts;
    private String description;
    private String userAccountId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
