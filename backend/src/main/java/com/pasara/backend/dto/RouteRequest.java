package com.pasara.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RouteRequest {

    @NotBlank
    private String source;

    @NotBlank
    private String destination;

}
