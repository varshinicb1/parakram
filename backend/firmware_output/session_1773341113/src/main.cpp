#include <Arduino.h>

void setup() {
  Serial.begin(115200);
  Serial.println("Setup function called");
}

void loop() {
  Serial.println("Loop function called");
  delay(1000);
}