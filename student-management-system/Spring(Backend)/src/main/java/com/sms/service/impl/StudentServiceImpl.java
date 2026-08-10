package com.sms.service.impl;

import com.sms.dto.PageResponse;
import com.sms.dto.StudentRequest;
import com.sms.dto.StudentResponse;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.Course;
import com.sms.model.Student;
import com.sms.repository.CourseRepository;
import com.sms.repository.StudentRepository;
import com.sms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    public StudentResponse create(StudentRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A student with email " + request.getEmail() + " already exists");
        }

        Set<String> courseIds = validateCourseIds(request.getEnrolledCourseIds());

        Student student = Student.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .enrolledCourseIds(courseIds)
                .build();

        return toResponse(studentRepository.save(student));
    }

    @Override
    public StudentResponse getById(String id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public PageResponse<StudentResponse> list(int page, int size, String search) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1), Sort.by("lastName").ascending());

        Page<Student> result = StringUtils.hasText(search)
                ? studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(search, search, pageable)
                : studentRepository.findAll(pageable);

        List<StudentResponse> content = result.getContent().stream().map(this::toResponse).toList();

        return PageResponse.<StudentResponse>builder()
                .content(content)
                .page(result.getNumber())
                .size(result.getSize())
                .totalElements(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .last(result.isLast())
                .build();
    }

    @Override
    public StudentResponse update(String id, StudentRequest request) {
        Student student = findOrThrow(id);

        if (!student.getEmail().equalsIgnoreCase(request.getEmail())
                && studentRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("A student with email " + request.getEmail() + " already exists");
        }

        Set<String> courseIds = validateCourseIds(request.getEnrolledCourseIds());

        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setDateOfBirth(request.getDateOfBirth());
        student.setEnrolledCourseIds(courseIds);
        student.setUpdatedAt(Instant.now());

        return toResponse(studentRepository.save(student));
    }

    @Override
    public void delete(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    @Override
    public StudentResponse enrollInCourse(String studentId, String courseId) {
        Student student = findOrThrow(studentId);
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        student.getEnrolledCourseIds().add(courseId);
        student.setUpdatedAt(Instant.now());
        return toResponse(studentRepository.save(student));
    }

    private Set<String> validateCourseIds(Set<String> courseIds) {
        if (courseIds == null || courseIds.isEmpty()) return new HashSet<>();
        for (String cid : courseIds) {
            if (!courseRepository.existsById(cid)) {
                throw new ResourceNotFoundException("Course not found with id: " + cid);
            }
        }
        return new HashSet<>(courseIds);
    }

    private Student findOrThrow(String id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    private StudentResponse toResponse(Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .email(s.getEmail())
                .phone(s.getPhone())
                .dateOfBirth(s.getDateOfBirth())
                .enrolledCourseIds(s.getEnrolledCourseIds())
                .createdAt(s.getCreatedAt())
                .updatedAt(s.getUpdatedAt())
                .build();
    }
}
