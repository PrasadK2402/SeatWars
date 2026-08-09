package com.pasara.backend.controller;

import com.pasara.backend.dto.RouteRequest;
import com.pasara.backend.dto.RouteResponse;
import com.pasara.backend.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @PostMapping
    public ResponseEntity<RouteResponse> createRoute(@Valid @RequestBody RouteRequest routeRequest){
       RouteResponse routeResponse =  routeService.createRoute(routeRequest);
       return ResponseEntity.ok(routeResponse);
    }

    @GetMapping
    public ResponseEntity<List<RouteResponse>> getAllRoutes(){
       List<RouteResponse> routes = routeService.getAllRoutes();
       return ResponseEntity.ok(routes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteResponse> getRouteById(@PathVariable Long id){
        RouteResponse route = routeService.getRouteById(id);
        return ResponseEntity.ok(route);
    }
}
