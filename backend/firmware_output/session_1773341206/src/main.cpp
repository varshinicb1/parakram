#include <Arduino.h>
// Include the necessary libraries for deep sleep and timer
#include "esp_sleep.h"
#include "driver/timer.h"

// Define the deep sleep duration in seconds
#define DEEP_SLEEP_DURATION 300 // 5 minutes

// Define the timer group and index
#define TIMER_GROUP TIMER_GROUP_0
#define TIMER_IDX TIMER_0

// Define the timer interrupt handler
volatile bool timer_interrupt_flag = false;

// Timer interrupt handler
void IRAM_ATTR timer_isr_handler(void *arg) {
  // Set the flag to indicate a timer interrupt occurred
  timer_interrupt_flag = true;
}

void setup() {
  // Initialize the serial communication for debug output
  Serial.begin(115200);
  Serial.println("Setup started");

  // Configure the timer
  timer_config_t config = {
    .alarm_en = TIMER_ALARM_EN,
    .counter_en = TIMER_PAUSE,
    .intr_type = TIMER_INTR_LEVEL,
    .counter_dir = TIMER_COUNT_UP,
    .auto_reload = TIMER_AUTORELOAD_EN,
    .divider = 80 // 1 MHz / 80 = 12.5 kHz
  };

  // Initialize the timer
  timer_init(TIMER_GROUP, TIMER_IDX, &config);

  // Set the timer alarm value
  timer_set_alarm_value(TIMER_GROUP, TIMER_IDX, DEEP_SLEEP_DURATION * 12.5 * 1000); // Convert seconds to ticks

  // Set the timer interrupt handler
  timer_enable_intr(TIMER_GROUP, TIMER_IDX);
  timer_isr_handler_add(TIMER_GROUP, TIMER_IDX, timer_isr_handler, NULL, ESP_INTR_FLAG_IRAM);

  // Enable the timer
  timer_start(TIMER_GROUP, TIMER_IDX);

  Serial.println("Setup completed");
}

void loop() {
  // Enter deep sleep mode
  Serial.println("Entering deep sleep mode");
  esp_sleep_enable_timer_wakeup(DEEP_SLEEP_DURATION * 1000000); // Convert seconds to microseconds
  esp_sleep_pd_config(ESP_PD_DOMAIN_RTC_PERIPH, ESP_PD_OPTION_ON);
  esp_light_sleep_start();

  // If we reach this point, it means we woke up from deep sleep
  Serial.println("Woke up from deep sleep");

  // Disable the timer
  timer_pause(TIMER_GROUP, TIMER_IDX);

  // Clear the timer interrupt flag
  timer_interrupt_flag = false;

  // Reset the timer alarm value
  timer_set_alarm_value(TIMER_GROUP, TIMER_IDX, DEEP_SLEEP_DURATION * 12.5 * 1000); // Convert seconds to ticks

  // Start the timer again
  timer_start(TIMER_GROUP, TIMER_IDX);

  delay(1000); // Wait for 1 second before entering deep sleep again
}