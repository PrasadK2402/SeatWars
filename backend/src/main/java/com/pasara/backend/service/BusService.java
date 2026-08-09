package com.pasara.backend.service;

import com.pasara.backend.Model.Bus;
import com.pasara.backend.dto.BusRequest;
import com.pasara.backend.dto.BusResponse;
import com.pasara.backend.exception.BusNotFoundException;
import com.pasara.backend.repository.BusRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository repository;

    public List<BusResponse> getAllBuses() {
        List<Bus> buses =  repository.findAll();
        // Converting each bus into bus response
       return buses
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private BusResponse toResponse(Bus bus) {

        return new BusResponse(
                bus.getId(),
                bus.getBusNumber(),
                bus.getOperatorName(),
                bus.getBusType(),
                bus.getTotalSeats()
        );
    }

    public BusResponse createBus(@Valid BusRequest request) {
        Bus bus = new Bus();
        bus.setBusNumber(request.getBusNumber());
        bus.setOperatorName(request.getOperatorName());
        bus.setBusType(request.getBusType());
        bus.setTotalSeats(request.getTotalSeats());

        Bus savedBus = repository.save(bus);
        return toResponse(savedBus);

    }

    public BusResponse getBusById(Long id) {
        Bus bus =  repository.findById(id)
                .orElseThrow(() -> new BusNotFoundException(id));
        return toResponse(bus);
    }

    public BusResponse updateBus(Long id, @Valid  BusRequest request){
          Bus existingBus =  repository.findById(id)
                .orElseThrow(() -> new BusNotFoundException(id));
          existingBus.setBusNumber(request.getBusNumber());
          existingBus.setOperatorName(request.getOperatorName());
          existingBus.setBusType(request.getBusType());
          existingBus.setTotalSeats(request.getTotalSeats());

          Bus updateBus = repository.save(existingBus);

           return toResponse(updateBus);

    }

    public void deleteBus(Long id) {
        Bus deleteBus = repository.findById(id)
                .orElseThrow(() -> new BusNotFoundException(id));
        repository.delete(deleteBus);
    }
}
