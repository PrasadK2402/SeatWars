package com.pasara.backend.exception;

public class SeatNotAvailableException extends RuntimeException {
    public SeatNotAvailableException(Long tripSeatId) {
        super("Seat with tripSeatId "+ tripSeatId + " is not available.");
    }
}
