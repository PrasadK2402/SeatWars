package com.pasara.backend.controller;

import com.pasara.backend.dto.TripRequest;
import com.pasara.backend.dto.TripResponse;
import com.pasara.backend.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @Valid @RequestBody TripRequest request) {

        TripResponse response = tripService.createTrip(request);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getAllTrips() {

        List<TripResponse> trips = tripService.getAllTrips();

        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTripById(
            @PathVariable Long id) {

        TripResponse response = tripService.getTripById(id);

        return ResponseEntity.ok(response);
    }
}