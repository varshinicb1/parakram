#include "bme280.h"

#define BME280_I2C_ADDRESS 0x76

static bool bme280_initialized = false;

bool bme280_setup(uint8_t i2c_address) {
    Wire.begin();

    uint8_t id;
    for (int i = 0; i < 5; ++i) { // Retry up to 5 times
        Wire.beginTransmission(i2c_address);
        Wire.write(0xD0); // Chip ID register
        Wire.endTransmission();
        Wire.requestFrom(i2c_address, 1);
        if (Wire.available()) {
            id = Wire.read();
            break;
        }
    }

    if (id != 0x60) {
        Serial.println("BME280 chip ID mismatch!");
        return false;
    }

    // Initialize BME280 here
    // Example: Set config register, control humidity register, etc.

    bme280_initialized = true;
    return true;
}

float bme280_read_temperature() {
    if (!bme280_initialized) {
        Serial.println("BME280 not initialized!");
        return NAN;
    }

    uint8_t data[3];
    for (int i = 0; i < 5; ++i) { // Retry up to 5 times
        Wire.beginTransmission(BME280_I2C_ADDRESS);
        Wire.write(0xFA); // Temperature MSB register
        Wire.endTransmission();
        Wire.requestFrom(BME280_I2C_ADDRESS, 3);

        if (Wire.available() == 3) {
            data[0] = Wire.read();
            data[1] = Wire.read();
            data[2] = Wire.read();

            int32_t adc_T = ((int32_t)data[0] << 16) | ((int32_t)data[1] << 8) | data[2];

            // Calculate temperature
            // Example: float temperature = (adc_T / 16384.0f) - 40.0f;

            return adc_T / 16384.0f - 40.0f; // Simplified example
        }
    }

    Serial.println("Failed to read temperature from BME280.");
    return NAN;
}