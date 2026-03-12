#include <Arduino.h>
#include "config.h"

#define DEEP_SLEEP_TIME 300 // Deep sleep duration in seconds (5 minutes)

void setup() {
    Serial.begin(115200);
    delay(1000); // Wait for serial port to initialize

    // Configure deep sleep
    esp_sleep_enable_timer_wakeup(DEEP_SLEEP_TIME * uS_TO_S_FACTOR);

    Serial.println("ESP32 is going to enter deep sleep mode...");
    esp_deep_sleep_start();
}

void loop() {
    // This function should never be reached
    Serial.println("This should not print");
}