package com.pasara.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatRequest {

    @NotBlank
    private String seatNumber;
    @NotBlank
    private String seatType;


}
