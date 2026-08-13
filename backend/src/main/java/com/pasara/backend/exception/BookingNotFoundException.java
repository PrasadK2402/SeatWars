package com.pasara.backend.exception;

public class BookingNotFoundException extends RuntimeException {
    public BookingNotFoundException(Long id) {
        super("Booking with id " + " not found.");
    }
}
