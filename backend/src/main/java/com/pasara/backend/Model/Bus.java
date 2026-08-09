package com.pasara.backend.Model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String busNumber;
    @NotBlank
    private String operatorName;
    @NotBlank
    private String busType;
    @Min(1)
    private int totalSeats;

    @OneToMany(mappedBy = "bus")
    private List<Seat> seats;

}