package com.dashplaygrounds.boardwall.models;

import java.time.ZonedDateTime;
import java.util.HashMap;

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
@Table(name = "sticky_notes")
@Entity
public class StickyNote {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String title;

    @Column(name = "content", length = 2048)
    private String content;
    private String color;
    private HashMap<String,Float> position;
    private String size;
    private String boardId;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}
