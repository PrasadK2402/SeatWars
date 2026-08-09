package com.pasara.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusRequest {
    @NotBlank
    private String busNumber;

    @NotBlank
    private String busType;

    @NotBlank
    private String operatorName;

    @Min(1)
    private int totalSeats;

    public BusRequest(){

    }
}
