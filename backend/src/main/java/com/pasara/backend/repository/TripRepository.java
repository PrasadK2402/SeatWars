package com.pasara.backend.repository;

import com.pasara.backend.Model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByRouteSourceAndRouteDestinationAndTravelDate(
            String Source,
            String destination,
            LocalDate travelDate
    );
}
