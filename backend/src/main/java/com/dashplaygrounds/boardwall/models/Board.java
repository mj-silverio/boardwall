package com.dashplaygrounds.boardwall.models;

import java.time.ZonedDateTime;

import jakarta.persistence.Column;
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
@Table(name = "boards")
@Entity
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    @Column(name = "name", length = 255)
    private String name;
    @Column(name = "description", length = 1024)
    private String description;
    private String categoryId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
