package com.sms.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    private String firstName;
    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String phone;
    private LocalDate dateOfBirth;

    // ids referencing Course documents this student is enrolled in
    @Builder.Default
    private Set<String> enrolledCourseIds = new HashSet<>();

    // Optional link to a User account (for STUDENT-role login), null if not created
    private String userId;

    @Builder.Default
    private Instant createdAt = Instant.now();
    private Instant updatedAt;
}
