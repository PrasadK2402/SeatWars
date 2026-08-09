package com.pasara.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class TripSearchRequest {

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

    @NotNull
    private LocalDate travelDate;
}
