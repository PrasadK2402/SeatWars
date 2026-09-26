package com.pasara.backend.controller;

import com.pasara.backend.dto.BookingRequest;
import com.pasara.backend.dto.BookingResponse;
import com.pasara.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@AllArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        BookingResponse response = bookingService.createBooking(request, userDetails.getUsername());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @AuthenticationPrincipal UserDetails userDetails
    ){
        return ResponseEntity.ok(
                bookingService.getMyBookings(userDetails.getUsername())
        );
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        return ResponseEntity.ok(
                bookingService.cancelBooking(id, userDetails.getUsername())
        );
    }
}
