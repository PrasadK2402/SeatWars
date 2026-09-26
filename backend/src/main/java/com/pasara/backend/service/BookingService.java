package com.pasara.backend.service;

import com.pasara.backend.Model.*;
import com.pasara.backend.dto.BookingCreatedEvent;
import com.pasara.backend.dto.BookingRequest;
import com.pasara.backend.dto.BookingResponse;
import com.pasara.backend.dto.TripResponse;
import com.pasara.backend.exception.BookingAccessException;
import com.pasara.backend.exception.BookingAlreadyCancelledException;
import com.pasara.backend.exception.BookingNotFoundException;
import com.pasara.backend.exception.SeatNotAvailableException;
import com.pasara.backend.exception.TripNotFoundException;
import com.pasara.backend.repository.BookingRepository;
import com.pasara.backend.repository.TripRepository;
import com.pasara.backend.repository.TripSeatRepository;
import com.pasara.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final TripSeatRepository tripSeatRepository;
    private final UserRepository userRepository;
    private final KafkaProducerService kafkaProducerService;

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
    public BookingResponse createBooking(BookingRequest request, String userEmail){

        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(
                        () -> new BookingAccessException("Authenticated user not found")
                );

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
        booking.setUser(user);
        booking.setPassengerName(request.getPassengerName());
        booking.setPassengerAge(request.getPassengerAge());
        booking.setPassengerGender(request.getPassengerGender());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setCreatedAt(LocalDateTime.now());

        Booking saveBooking = bookingRepository.save(booking);
        //event
        BookingCreatedEvent event = new BookingCreatedEvent(
                saveBooking.getId(),
                saveBooking.getTrip().getId(),
                saveBooking.getTripSeat().getId(),
                saveBooking.getPassengerName()
        );
        kafkaProducerService.sendBookingCreatedEvent(event);

        return toResponse(saveBooking);

    }

    @Transactional
    public List<BookingResponse> getMyBookings(String userEmail){

        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(
                        () -> new BookingAccessException("Authenticated user not found")
                );

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String userEmail){

        AppUser user = userRepository.findByEmail(userEmail)
                .orElseThrow(
                        () -> new BookingAccessException("Authenticated user not found")
                );

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(
                        () -> new BookingNotFoundException(bookingId)
                );

        if(booking.getUser() == null || !booking.getUser().getId().equals(user.getId())){
            throw new BookingAccessException("You can only cancel your own bookings");
        }

        if(booking.getStatus() == BookingStatus.CANCELLED){
            throw new BookingAlreadyCancelledException("This booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.getTripSeat().setStatus(TripSeatStatus.AVAILABLE);

        return toResponse(booking);
    }
}
