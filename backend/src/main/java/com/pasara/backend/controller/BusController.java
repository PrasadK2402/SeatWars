package com.pasara.backend.controller;

import com.pasara.backend.Model.Bus;
import com.pasara.backend.service.BusService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@Controller
@RequestMapping("/api")
public class BusController {


    private final BusService service;

    public BusController(BusService service) {
        this.service = service;
    }

    @GetMapping("/buses")
    public ResponseEntity<List<Bus>> getAllBuses(){
        List<Bus> buses = service.getAllBuses();
        return ResponseEntity.ok(buses);
    }

    @PostMapping("/buses")
    public ResponseEntity<Bus> createBus(@Valid  @RequestBody Bus bus){
        Bus savedBus = service.createBus(bus);
        return ResponseEntity.ok(savedBus);
    }

    @GetMapping("/buses/{id}")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id){
        Bus bus = service.getBusById(id);
        return ResponseEntity.ok(bus);
    }

    @PutMapping("/buses/{id}")
    public ResponseEntity<Bus> updateBusById(@PathVariable Long id, @Valid @RequestBody Bus bus){
        Bus updateBus = service.updateBus(id,bus);
        return ResponseEntity.ok(updateBus);
    }

}
