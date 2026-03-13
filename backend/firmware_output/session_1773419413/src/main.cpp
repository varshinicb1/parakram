// Import necessary libraries
#include <Arduino.h>
#include "config.h"

// Define deep sleep pin (not required for ESP32, but added for clarity)
#define DEEP_SLEEP_PIN -1 // Not used on ESP32

// Function to enter deep sleep mode
void enterDeepSleep() {
  // Enable timer wake up
  esp_sleep_enable_timer_wakeup(DEEP_SLEEP_TIME_S * 1000000); // Convert seconds to microseconds
  // Enter deep sleep mode
  esp_deep_sleep_start();
}

void setup() {
  // Initialize serial communication
  Serial.begin(SERIAL_BAUDRATE);
  while (!Serial) {
    // Wait for serial to become available
  }
  Serial.println("Setup started");

  // Print deep sleep time
  Serial.print("Deep sleep time: ");
  Serial.print(DEEP_SLEEP_TIME_S);
  Serial.println(" seconds");

  // Enter deep sleep mode
  enterDeepSleep();
}

void loop() {
  // This loop should not be executed in deep sleep mode
  // However, it's added for completeness and potential future modifications
  Serial.println("Loop started");
  delay(1000); // Wait for 1 second
}