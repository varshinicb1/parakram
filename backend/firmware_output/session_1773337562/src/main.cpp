#include <Wire.h>
#include "config.h"

#define I2C_ADDRESS 0x50

void setup() {
    Serial.begin(9600);
    Wire.begin();

    if (!i2c_scanner()) {
        Serial.println("I2C scanner failed!");
        while (1);
    }

    Serial.println("I2C scan complete.");
}

void loop() {
    // Main loop can be empty for this simple example
}

bool i2c_scanner() {
    byte error, address;
    int nDevices;

    Serial.println("Scanning...");

    nDevices = 0;
    for (address = 1; address < 127; address++) {
        Wire.beginTransmission(address);
        error = Wire.endTransmission();

        if (error == 0) {
            Serial.print("I2C device found at address 0x");
            if (address < 16)
                Serial.print("0");
            Serial.print(address, HEX);
            Serial.println("  !");
            nDevices++;
        } else if (error == 4) {
            Serial.print("Unknown error at address 0x");
            if (address < 16)
                Serial.print("0");
            Serial.println(address, HEX);
        }
    }

    if (nDevices == 0) {
        Serial.println("No I2C devices found\n");
        return false;
    } else {
        Serial.print("done\n");
        return true;
    }
}