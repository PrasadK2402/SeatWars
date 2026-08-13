package com.pasara.backend.dto;

import com.pasara.backend.Model.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class BookingResponse {
    private Long bookingId;
    private Long tripId;
    private Long tripSeatId;
    private String seatNumber;
    private String passengerName;
    private int passengerAge;
    private String passengerGender;
    private BookingStatus status;
    private LocalDateTime createdAt;


}
