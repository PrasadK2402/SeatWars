package com.pasara.backend.controller;

import com.pasara.backend.dto.TripRequest;
import com.pasara.backend.dto.TripResponse;
import com.pasara.backend.dto.TripSearchRequest;
import com.pasara.backend.dto.TripSeatResponse;
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
    // Trip Search based on source, destination and trip date
    @PostMapping("/search")
    public ResponseEntity<List<TripResponse>> searchTrips(
            @Valid @RequestBody TripSearchRequest request) {

        List<TripResponse> trips = tripService.searchTrips(request);

        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{tripId}/seats")
    public ResponseEntity<List<TripSeatResponse>> getTripSeats(
            @PathVariable Long tripId) {

        List<TripSeatResponse> seats =
                tripService.getSeatsForTrip(tripId);

        return ResponseEntity.ok(seats);
    }
}