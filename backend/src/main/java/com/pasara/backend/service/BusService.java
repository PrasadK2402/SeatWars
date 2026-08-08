package com.pasara.backend.service;

import com.pasara.backend.Model.Bus;
import com.pasara.backend.exception.BusNotFoundException;
import com.pasara.backend.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository repository;

    public List<Bus> getAllBuses() {
        return repository.findAll();
    }

    public Bus createBus(Bus bus) {
        return repository.save(bus);

    }

    public Bus getBusById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusNotFoundException(id));

    }

    public Bus updateBus(Long id, Bus bus){
          Bus existingBus =  repository.findById(id)
                .orElseThrow(() -> new BusNotFoundException(id));
          existingBus.setBusNumber(bus.getBusNumber());
          existingBus.setOperatorName(bus.getOperatorName());
          existingBus.setBusType(bus.getBusType());
          existingBus.setTotalSeats(bus.getTotalSeats());

           return repository.save(existingBus);

    }
}
