package com.pasara.backend.exception;

public class RouteNotFoundException extends RuntimeException{
    public RouteNotFoundException(Long id) {
        super("Route with id " + id + " not found");
    }
}
