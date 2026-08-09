package com.pasara.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BusResponse {
    private Long id;
    private String busNumber;
    private String operatorName;
    private String busType;
    private int totalSeats;

    public BusResponse() {
    }

    public BusResponse(Long id, String busNumber, String operatorName,
                       String busType, int totalSeats) {
        this.id = id;
        this.busNumber = busNumber;
        this.operatorName = operatorName;
        this.busType = busType;
        this.totalSeats = totalSeats;
    }

}
