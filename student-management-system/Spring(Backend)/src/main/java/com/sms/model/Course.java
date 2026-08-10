package com.sms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class Course {

    @Id
    private String id;

    @Indexed(unique = true)
    private String code;      // e.g. "CS101"
    private String name;      // e.g. "Introduction to Computer Science"
    private String description;
    private int credits;

    // References a teacher's User id (optional)
    private String teacherId;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
