package com.sms.service;

import com.sms.dto.AuthRequest;
import com.sms.dto.AuthResponse;
import com.sms.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
}
