// Import necessary libraries
#include <Arduino.h>
#include <driver/rtc_io.h>
#include <esp_sleep.h>

// Define pin for serial debug output
#define SERIAL_DEBUG_PIN 1

// Define deep sleep duration in microseconds (5 minutes)
#define DEEP_SLEEP_DURATION 5 * 60 * 1000000

// Define a flag to track if we are in deep sleep
volatile bool isDeepSleep = false;

// Function to configure deep sleep
void configureDeepSleep() {
  // Enable the timer to wake up from deep sleep
  esp_sleep_enable_timer_wakeup(DEEP_SLEEP_DURATION);
}

// Interrupt Service Routine (ISR) for timer wake up
void IRAM_ATTR timerWakeUp() {
  // Set the flag to indicate we are waking up from deep sleep
  isDeepSleep = false;
}

// Setup function
void setup() {
  // Initialize serial communication for debug output
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  // Configure deep sleep
  configureDeepSleep();

  // Print a message to indicate we are going to deep sleep
  Serial.println("Going to deep sleep");

  // Enter deep sleep
  esp_deep_sleep_start();
}

// Loop function
void loop() {
  // This function should not be called when in deep sleep
  if (!isDeepSleep) {
    // Print a message to indicate we are awake
    Serial.println("Awake from deep sleep");

    // Put your code here to perform tasks when awake

    // Go back to deep sleep after tasks are completed
    configureDeepSleep();
    esp_deep_sleep_start();
  }
}