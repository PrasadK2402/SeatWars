package com.pasara.backend.service;

import com.pasara.backend.dto.BookingCreatedEvent;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    public void sendBookingConfirmation(BookingCreatedEvent event) {

        System.out.println("===== BOOKING CONFIRMATION =====");
        System.out.println(
                "Booking #" + event.getBookingId()
                        + " confirmed for "
                        + event.getPassengerName()
        );
        System.out.println(
                "Trip: " + event.getTripId()
                        + " | Seat: " + event.getTripSeatId()
        );
        System.out.println("================================");
    }

}
