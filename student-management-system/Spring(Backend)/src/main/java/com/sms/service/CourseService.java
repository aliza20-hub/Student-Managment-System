package com.sms.service;

import com.sms.dto.CourseRequest;
import com.sms.dto.CourseResponse;

import java.util.List;

public interface CourseService {
    CourseResponse create(CourseRequest request);
    CourseResponse getById(String id);
    List<CourseResponse> listAll();
    CourseResponse update(String id, CourseRequest request);
    void delete(String id);
}
