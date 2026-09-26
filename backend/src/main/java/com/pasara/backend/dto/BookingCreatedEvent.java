package com.pasara.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class BookingCreatedEvent {

    private Long bookingId;
    private Long tripId;
    private Long tripSeatId;
    private String passengerName;
}
