package com.pasara.backend.controller;

import com.pasara.backend.Model.Bus;
import com.pasara.backend.dto.BusRequest;
import com.pasara.backend.dto.BusResponse;
import com.pasara.backend.service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.node.StringNode;


import java.util.List;

@Controller
@RequestMapping("/api")
@RequiredArgsConstructor
public class BusController {


    private final BusService service;

//    public BusController(BusService service) {
//        this.service = service;
//    }

    @GetMapping("/buses")
    public ResponseEntity<List<BusResponse>> getAllBuses(){
        List<BusResponse> buses = service.getAllBuses();
        return ResponseEntity.ok(buses);
    }

    @PostMapping("/buses")
    public ResponseEntity<BusResponse> createBus(@Valid  @RequestBody BusRequest request){
        BusResponse response = service.createBus(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<BusResponse> getBusById(@PathVariable Long id){
        BusResponse bus = service.getBusById(id);
        return ResponseEntity.ok(bus);
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<BusResponse> updateBusById(@PathVariable Long id, @Valid @RequestBody BusRequest request){
        BusResponse updateBus = service.updateBus(id,request);
        return ResponseEntity.ok(updateBus);
    }

    @DeleteMapping("/buses/{id}")
    public ResponseEntity<String> deleteBus(@PathVariable Long id){
        service.deleteBus(id);
        return ResponseEntity.ok("Bus deleted successFully");
    }

}
