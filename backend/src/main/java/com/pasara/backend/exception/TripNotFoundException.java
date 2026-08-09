package com.pasara.backend.exception;

public class TripNotFoundException extends RuntimeException {

    public TripNotFoundException(Long id) {
        super("Trip with id " + id + " not found");
    }

}
