package com.pasara.backend.dto;

import com.pasara.backend.Model.TripSeatStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class TripSeatResponse {
    private Long id;
    private Long seatId;
    private String seatNumber;
    private String seatType;
    private TripSeatStatus status;
}
