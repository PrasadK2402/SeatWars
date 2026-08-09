package com.pasara.backend.service;

import com.pasara.backend.Model.Bus;
import com.pasara.backend.Model.Route;
import com.pasara.backend.Model.Trip;
import com.pasara.backend.dto.TripRequest;
import com.pasara.backend.dto.TripResponse;
import com.pasara.backend.exception.BusNotFoundException;
import com.pasara.backend.exception.RouteNotFoundException;
import com.pasara.backend.exception.TripNotFoundException;
import com.pasara.backend.repository.BusRepository;
import com.pasara.backend.repository.RouteRepository;
import com.pasara.backend.repository.TripRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;

    private TripResponse toResponse(Trip trip){
        return new TripResponse(
                trip.getId(),
                trip.getBus().getId(),
                trip.getRoute().getId(),
                trip.getRoute().getSource(),
                trip.getRoute().getDestination(),
                trip.getTravelDate(),
                trip.getDepartureTime(),
                trip.getArrivalTime()
        );
    }

    public TripResponse createTrip(TripRequest tripRequest){
        Bus bus = busRepository.findById(tripRequest.getBusId())
                .orElseThrow(() -> new BusNotFoundException(tripRequest.getBusId()));
        Route route = routeRepository.findById(tripRequest.getRouteId())
                .orElseThrow(() -> new RouteNotFoundException(tripRequest.getRouteId()));
        Trip trip = new Trip();
        trip.setBus(bus);
        trip.setRoute(route);
        trip.setTravelDate(tripRequest.getTravelDate());
        trip.setArrivalTime(tripRequest.getArrivalTime());
        trip.setDepartureTime(tripRequest.getDepartureTime());

        Trip savedTrip = tripRepository.save(trip);
        return toResponse(savedTrip);
    }

    public List<TripResponse> getAllTrips() {

        return tripRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TripResponse getTripById(Long id) {

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new TripNotFoundException(id));

        return toResponse(trip);
    }}
