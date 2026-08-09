package com.pasara.backend.service;

import com.pasara.backend.Model.Route;
import com.pasara.backend.dto.RouteRequest;
import com.pasara.backend.dto.RouteResponse;
import com.pasara.backend.exception.RouteNotFoundException;
import com.pasara.backend.repository.RouteRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class RouteService {

    private final RouteRepository routeRepository;



    private RouteResponse toResponse(Route route) {
        return new RouteResponse(
                route.getId(),
                route.getSource(),
                route.getDestination()
        );
    }

    public RouteResponse createRoute(RouteRequest request) {

        Route route = new Route();

        route.setSource(request.getSource());
        route.setDestination(request.getDestination());

        Route savedRoute = routeRepository.save(route);

        return toResponse(savedRoute);
    }


    public List<RouteResponse> getAllRoutes() {

        return routeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RouteResponse getRouteById(Long id) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RouteNotFoundException(id));

        return toResponse(route);
    }


}
