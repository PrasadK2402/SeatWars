package com.pasara.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class BookingRequest {
    @NotNull
    private Long tripId;

    @NotNull
    private Long tripSeatId;

    @NotBlank
    private String passengerName;

    @Min(1)
    private int passengerAge;

    @NotBlank
    private String passengerGender;
}
