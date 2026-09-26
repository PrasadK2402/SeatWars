package com.pasara.backend.service;

import com.pasara.backend.dto.BookingCreatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private static final String TOPIC = "booking-events";

    private final KafkaTemplate<String, BookingCreatedEvent> kafkaTemplate;

    public KafkaProducerService(
            KafkaTemplate<String, BookingCreatedEvent> kafkaTemplate
    ) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendBookingCreatedEvent(BookingCreatedEvent event) {
        kafkaTemplate.send(TOPIC, event);
    }
}