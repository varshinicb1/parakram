#include <Wire.h>
#include "config.h"

#define I2C_ADDRESS 0x50

void setup() {
    Serial.begin(9600);
    while (!Serial) {}

    if (i2c_scanner(I2C_ADDRESS)) {
        Serial.println("I2C device found at address: 0x50");
    } else {
        Serial.println("No I2C devices found.");
    }
}

void loop() {
    // Nothing to do in the loop for this simple scanner
}

// Function to scan for I2C devices on a specific address
bool i2c_scanner(uint8_t address) {
    Wire.beginTransmission(address);
    byte error = Wire.endTransmission();

    if (error == 0) {
        return true;
    } else if (error == 4) {
        Serial.println("Unknown error in transmission.");
    }

    return false;
}

// FILE: config.h
// Configuration defines for the I2C scanner
#define I2C_ADDRESS 0x50