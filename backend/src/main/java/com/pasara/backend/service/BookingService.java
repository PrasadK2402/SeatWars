package com.pasara.backend.service;

import com.pasara.backend.Model.*;
import com.pasara.backend.dto.BookingRequest;
import com.pasara.backend.dto.BookingResponse;
import com.pasara.backend.dto.TripResponse;
import com.pasara.backend.exception.SeatNotAvailableException;
import com.pasara.backend.exception.TripNotFoundException;
import com.pasara.backend.repository.BookingRepository;
import com.pasara.backend.repository.TripRepository;
import com.pasara.backend.repository.TripSeatRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@AllArgsConstructor
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final TripSeatRepository tripSeatRepository;

    private BookingResponse toResponse(Booking booking){
        return new BookingResponse(
                booking.getId(),
                booking.getTrip().getId(),
                booking.getTripSeat().getId(),
                booking.getTripSeat().getSeat().getSeatNumber(),
                booking.getPassengerName(),
                booking.getPassengerAge(),
                booking.getPassengerGender(),
                booking.getStatus(),
                booking.getCreatedAt()
        );
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request){

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(
                        () -> new TripNotFoundException(request.getTripId())
                );

        TripSeat tripSeat = tripSeatRepository.findById(request.getTripSeatId())
                .orElseThrow(
                        () -> new SeatNotAvailableException(request.getTripSeatId())
                );

        if(!tripSeat.getTrip().getId().equals(trip.getId())){
            throw new SeatNotAvailableException(request.getTripSeatId());
        }

        if(tripSeat.getStatus() != TripSeatStatus.AVAILABLE){
                throw new SeatNotAvailableException(request.getTripId());
        }

        tripSeat.setStatus(TripSeatStatus.BOOKED);

        Booking booking = new Booking();

        booking.setTrip(trip);
        booking.setTripSeat(tripSeat);
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerAge(request.getPassengerAge());
        booking.setPassengerGender(request.getPassengerGender());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        Booking saveBooking = bookingRepository.save(booking);

        return toResponse(saveBooking);

    }
}
