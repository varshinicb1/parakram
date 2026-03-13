// Import necessary libraries
#include <Arduino.h>

// Define the LED pin
#define LED_PIN 2

void setup() {
  // Initialize serial communication for debug output
  Serial.begin(115200);
  Serial.println("Setup started");

  // Configure the LED pin as an output
  // We use pinMode() to set the direction of the pin
  pinMode(LED_PIN, OUTPUT);
  
  Serial.println("Setup completed");
}

void loop() {
  // Turn the LED on
  // We use digitalWrite() to set the state of the pin
  digitalWrite(LED_PIN, HIGH);
  Serial.println("LED on");
  
  // Wait for 1 second
  // We use delay() to introduce a time delay
  delay(1000);
  
  // Turn the LED off
  digitalWrite(LED_PIN, LOW);
  Serial.println("LED off");
  
  // Wait for 1 second
  delay(1000);
}