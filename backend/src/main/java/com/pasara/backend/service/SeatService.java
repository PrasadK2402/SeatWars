package com.pasara.backend.service;

import com.pasara.backend.Model.Bus;
import com.pasara.backend.Model.Seat;
import com.pasara.backend.dto.SeatRequest;
import com.pasara.backend.dto.SeatResponse;
import com.pasara.backend.exception.BusNotFoundException;
import com.pasara.backend.repository.BusRepository;
import com.pasara.backend.repository.SeatRepository;
import jakarta.validation.constraints.Email;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final BusRepository busRepository;

    public SeatService(SeatRepository seatRepository, BusRepository busRepository){
        this.seatRepository = seatRepository;
        this.busRepository = busRepository;
    }

    private SeatResponse toResponse(Seat seat){
        return new SeatResponse(
                seat.getId(),
                seat.getSeatNumber(),
                seat.getSeatType()
        );
    }

    public SeatResponse createSeat(Long busId, SeatRequest seatRequest){

        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new BusNotFoundException(busId));

        Seat seat = new Seat();
        seat.setSeatNumber(seatRequest.getSeatNumber());
        seat.setSeatType(seatRequest.getSeatType());
        seat.setBus(bus);
        Seat savedSeat = seatRepository.save(seat);
        return toResponse(savedSeat);
    }

    public List<SeatResponse> getSeatsByBus(Long busId){
        busRepository.findById(busId)
                .orElseThrow(() -> new BusNotFoundException(busId));
        return seatRepository.findByBusId(busId)
                .stream()
                .map(this::toResponse)
                .toList();
    }
}
