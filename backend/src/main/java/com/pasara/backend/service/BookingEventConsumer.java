package com.pasara.backend.service;

import com.pasara.backend.dto.BookingCreatedEvent;
import lombok.AllArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class BookingEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "booking-events",
            groupId = "pasara-booking-consumer"
    )

    public void consumeBookingCreatedEvent(BookingCreatedEvent event){
        notificationService.sendBookingConfirmation(event);
    }
}
