package com.pasara.backend.service;

import com.pasara.backend.Model.AppUser;
import com.pasara.backend.Model.Role;
import com.pasara.backend.dto.AuthResponse;
import com.pasara.backend.dto.LoginRequest;
import com.pasara.backend.dto.RegisterRequest;
import com.pasara.backend.exception.EmailAlreadyExistsException;
import com.pasara.backend.exception.InvalidCredentialsException;
import com.pasara.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder  passwordEncoder;
    private final JwtService jwtService;

    public AuthService(JwtService jwtService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request){

        if(userRepository.existsByEmail(request.getEmail())){
            throw new EmailAlreadyExistsException("Email already Registered");
        }

        AppUser user = new AppUser();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.CUSTOMER);

        AppUser savedUser = userRepository.save(user);

        String token = jwtService.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
        return new AuthResponse(
                token,
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request){

        AppUser user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(
                        () -> new InvalidCredentialsException("Invalid email or password")
                );

        if(!passwordEncoder.matches(
                request.getPassword(), user.getPassword()
        )){
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}

