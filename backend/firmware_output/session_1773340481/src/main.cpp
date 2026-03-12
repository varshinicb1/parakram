#include <Arduino.h>

void setup() {
  // Initialize serial communication at 115200 bits per second
  Serial.begin(115200);
  
  // Print a message to the serial monitor
  Serial.println("Firmware started");
}

void loop() {
  // Put your main code here, to run repeatedly:
  delay(1000);
  Serial.println("Hello, World!");
}