package com.pasara.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeatResponse {

    private Long id;
    private String seatNumber;
    private String seatType;

    public SeatResponse(){

    }
    public SeatResponse(Long id, String seatNumber, String seatType){
        this.id = id;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
    }

}
