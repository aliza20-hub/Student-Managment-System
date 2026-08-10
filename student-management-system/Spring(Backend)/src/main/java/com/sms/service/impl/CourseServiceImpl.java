package com.sms.service.impl;

import com.sms.dto.CourseRequest;
import com.sms.dto.CourseResponse;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.Course;
import com.sms.repository.CourseRepository;
import com.sms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    @Override
    public CourseResponse create(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("A course with code " + request.getCode() + " already exists");
        }
        Course course = Course.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .credits(request.getCredits())
                .teacherId(request.getTeacherId())
                .build();
        return toResponse(courseRepository.save(course));
    }

    @Override
    public CourseResponse getById(String id) {
        return toResponse(findOrThrow(id));
    }

    @Override
    public List<CourseResponse> listAll() {
        return courseRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public CourseResponse update(String id, CourseRequest request) {
        Course course = findOrThrow(id);
        if (!course.getCode().equalsIgnoreCase(request.getCode()) && courseRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("A course with code " + request.getCode() + " already exists");
        }
        course.setCode(request.getCode());
        course.setName(request.getName());
        course.setDescription(request.getDescription());
        course.setCredits(request.getCredits());
        course.setTeacherId(request.getTeacherId());
        return toResponse(courseRepository.save(course));
    }

    @Override
    public void delete(String id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    private Course findOrThrow(String id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
    }

    private CourseResponse toResponse(Course c) {
        return CourseResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .name(c.getName())
                .description(c.getDescription())
                .credits(c.getCredits())
                .teacherId(c.getTeacherId())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
