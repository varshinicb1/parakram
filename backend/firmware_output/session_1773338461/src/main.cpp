#include <Arduino.h>
#include "bme280.h"

#define BME280_I2C_ADDRESS 0x76

void setup() {
    Serial.begin(115200);

    if (!bme280_setup(BME280_I2C_ADDRESS)) {
        Serial.println("BME280 initialization failed!");
        while (true);
    }

    Serial.println("BME280 initialized successfully.");
}

void loop() {
    float temperature = bme280_read_temperature();
    if (isnan(temperature)) {
        Serial.println("Failed to read temperature from BME280.");
    } else {
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.println(" °C");
    }

    delay(2000); // Delay between readings
}