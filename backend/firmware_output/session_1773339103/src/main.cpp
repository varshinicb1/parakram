#include <Arduino.h>
#include "config.h"

#define LED_PIN GPIO2

void setup() {
  Serial.begin(115200);
  
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW); // Start with LED off
  
  Serial.println("LED blinker started");
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Turn LED on
  delay(1000);                 // Wait for a second
  digitalWrite(LED_PIN, LOW);  // Turn LED off
  delay(1000);                 // Wait for a second
  
  Serial.println("LED blinked");
}