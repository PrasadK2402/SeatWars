package com.pasara.backend.service;

import com.pasara.backend.Model.*;
import com.pasara.backend.dto.TripRequest;
import com.pasara.backend.dto.TripResponse;
import com.pasara.backend.dto.TripSearchRequest;
import com.pasara.backend.dto.TripSeatResponse;
import com.pasara.backend.exception.BusNotFoundException;
import com.pasara.backend.exception.RouteNotFoundException;
import com.pasara.backend.exception.TripNotFoundException;
import com.pasara.backend.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final BusRepository busRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository;
    private final TripSeatRepository tripSeatRepository;

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

    @Transactional
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
        // creating trip seats
        List <Seat> seats = seatRepository.findByBusId(bus.getId());
        List<TripSeat> tripSeats = seats.stream()
                .map(seat -> {

                    TripSeat tripSeat = new TripSeat();

                    tripSeat.setTrip(savedTrip);
                    tripSeat.setSeat(seat);
                    tripSeat.setStatus(TripSeatStatus.AVAILABLE);

                    return tripSeat;
                })
                .toList();

        tripSeatRepository.saveAll(tripSeats);
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
    }

    // Trip Search
    @Cacheable(
            value = "trips",
            key= "'trips:' + #request.source.toLowerCase() + ':' + #request.destination.toLowerCase() + ':' + #request.travelDate"
    )
    public List<TripResponse> searchTrips(TripSearchRequest request) {

        return tripRepository
                .findByRouteSourceAndRouteDestinationAndTravelDate(
                        request.getSource(),
                        request.getDestination(),
                        request.getTravelDate()
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<TripSeatResponse> getSeatsForTrip(Long tripId) {

        tripRepository.findById(tripId)
                .orElseThrow(() -> new TripNotFoundException(tripId));

        return tripSeatRepository.findByTripId(tripId)
                .stream()
                .map(tripSeat -> new TripSeatResponse(
                        tripSeat.getId(),
                        tripSeat.getSeat().getId(),
                        tripSeat.getSeat().getSeatNumber(),
                        tripSeat.getSeat().getSeatType(),
                        tripSeat.getStatus()
                ))
                .toList();
    }
}
