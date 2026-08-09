package com.pasara.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class TripRequest {
    @NotNull
    private Long busId;

    @NotNull
    private Long routeId;

    @NotNull
    private LocalDate travelDate;

    @NotNull
    private LocalTime departureTime;

    @NotNull
    private LocalTime arrivalTime;
}
