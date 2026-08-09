package com.pasara.backend.repository;

import com.pasara.backend.Model.TripSeat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripSeatRepository extends JpaRepository<TripSeat,Long> {
    List<TripSeat> findByTripId(Long tripId);
}
