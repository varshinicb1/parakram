#include <Arduino.h>
#include "mbed.h" // For CAN library
#include "CAN.h" // For CAN library
#include "config.h"

// Define CAN message structure
typedef struct {
  uint32_t id;
  uint8_t length;
  uint8_t data[8];
} CanMessage;

// Define CAN message buffer
CanMessage canMessage;

// Define CAN object
CAN can(CAN_RX_PIN, CAN_TX_PIN);

void setup() {
  // Initialize serial debug output
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.println("CAN Bus Reader");

  // Initialize CAN bus
  can.begin(CAN_BAUD_RATE);
  Serial.println("CAN bus initialized");
}

void loop() {
  // Check for incoming CAN messages
  if (can.read(canMessage.id, canMessage.data, canMessage.length)) {
    // Print CAN message to serial debug output
    Serial.print("CAN Message: ID = 0x");
    Serial.print(canMessage.id, HEX);
    Serial.print(", Length = ");
    Serial.print(canMessage.length);
    Serial.print(", Data = ");
    for (int i = 0; i < canMessage.length; i++) {
      Serial.print(canMessage.data[i], HEX);
      Serial.print(" ");
    }
    Serial.println();
  }

  // Delay to avoid flooding serial debug output
  delay(100);
}