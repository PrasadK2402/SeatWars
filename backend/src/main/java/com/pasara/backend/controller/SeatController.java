package com.pasara.backend.controller;

import com.pasara.backend.dto.SeatRequest;
import com.pasara.backend.dto.SeatResponse;
import com.pasara.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses/{busId}")
@RequiredArgsConstructor
public class SeatController {

    private final SeatService seatService;


    @PostMapping("/seats")
    public ResponseEntity<SeatResponse> createSeat(@PathVariable Long busId, @RequestBody SeatRequest seatRequest){
        SeatResponse createdSeat = seatService.createSeat(busId, seatRequest);
        return ResponseEntity.ok(createdSeat);
    }

    @GetMapping("/seats")
    public ResponseEntity<List<SeatResponse>> getSeatsByBus(@PathVariable Long busId){
        List<SeatResponse> allSeats = seatService.getSeatsByBus(busId);
        return ResponseEntity.ok(allSeats);
    }
}
