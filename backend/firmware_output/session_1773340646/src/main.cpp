// Import necessary libraries for I2C communication and serial output
#include <Arduino.h>
#include <Wire.h>

// Define I2C pins for Arduino Uno (SDA and SCL)
#define SDA_PIN 18
#define SCL_PIN 19

// Define serial baud rate for debug output
#define SERIAL_BAUD_RATE 115200

void setup() {
  // Initialize serial communication for debug output
  Serial.begin(SERIAL_BAUD_RATE);
  // Wait for serial connection to establish
  while (!Serial) {
    // Wait for serial connection
  }

  // Initialize I2C communication
  Wire.begin();
  // Set I2C clock speed to 400 kHz
  Wire.setClock(400000);

  Serial.println("I2C Scanner started");
}

void loop() {
  // Initialize a byte to store the address
  byte address;
  // Initialize a counter for the number of devices found
  int deviceCount = 0;

  Serial.println("Scanning I2C bus...");
  // Iterate over all possible I2C addresses (0x00 to 0x7F)
  for (address = 0; address <= 0x7F; address++) {
    // Send a start condition and the address
    Wire.beginTransmission(address);
    // If the transmission is successful, a device is present at this address
    if (Wire.endTransmission() == 0) {
      Serial.print("Device found at address 0x");
      Serial.println(address, HEX);
      deviceCount++;
    }
  }

  Serial.print("Total devices found: ");
  Serial.println(deviceCount);

  // Wait for 1 second before scanning again
  delay(1000);
}