#include <Arduino.h> // Include the Arduino library for standard functions
#include <Wire.h>     // Include the Wire library for I2C communication

// Define the I2C pins for Arduino Uno
#define SCL_PIN 21
#define SDA_PIN 20

// Define the baud rate for serial communication
#define SERIAL_BAUD_RATE 115200

void setup() {
  // Initialize the serial communication at the specified baud rate
  Serial.begin(SERIAL_BAUD_RATE);
  Serial.println("I2C Scanner");

  // Initialize the I2C communication
  Wire.begin();
  Wire.setClock(400000); // Set the I2C clock speed to 400 kHz

  // Print a message to indicate the start of the I2C scan
  Serial.println("Scanning I2C devices...");
}

void loop() {
  byte error, address;
  int nDevices;

  // Print a message to indicate the start of the I2C scan
  Serial.println("Scanning...");

  nDevices = 0;
  for (address = 1; address < 127; address++) {
    // The I2C scanner can scan for devices with addresses between 1 and 127
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0) {
      // If the device is found, print its address
      Serial.print("I2C device found at address 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.print(address, HEX);
      Serial.println("  !");

      nDevices++;
    } else if (error == 4) {
      // If the device is not found, print an error message
      Serial.print("Unknown error at address 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.println(address, HEX);
    }
  }

  if (nDevices == 0) {
    // If no devices are found, print a message
    Serial.println("No I2C devices found\n");
  } else {
    // If devices are found, print the total number of devices
    Serial.println("done\n");
  }

  // Wait for 5 seconds before scanning again
  delay(5000);
}