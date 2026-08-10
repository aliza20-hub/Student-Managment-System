package com.sms.service;

import com.sms.dto.PageResponse;
import com.sms.dto.StudentRequest;
import com.sms.dto.StudentResponse;

public interface StudentService {
    StudentResponse create(StudentRequest request);
    StudentResponse getById(String id);
    PageResponse<StudentResponse> list(int page, int size, String search);
    StudentResponse update(String id, StudentRequest request);
    void delete(String id);
    StudentResponse enrollInCourse(String studentId, String courseId);
}
