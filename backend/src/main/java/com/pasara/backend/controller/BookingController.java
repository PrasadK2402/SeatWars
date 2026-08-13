package com.pasara.backend.controller;

import com.pasara.backend.dto.BookingRequest;
import com.pasara.backend.dto.BookingResponse;
import com.pasara.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request
    ){
        BookingResponse response = bookingService.createBooking(request);

        return ResponseEntity.ok(response);
    }
}
