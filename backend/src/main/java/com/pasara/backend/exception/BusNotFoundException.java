package com.pasara.backend.exception;

public class BusNotFoundException extends RuntimeException {
    public BusNotFoundException(Long id){
        super("Bus with id " + id + " not found" );
    }
}
