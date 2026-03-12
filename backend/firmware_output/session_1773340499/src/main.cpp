#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_BME280.h>

// Define BME280 I2C address
#define BME280_ADDRESS 0x76

// Define BME280 pins
#define BME280_SDA 21
#define BME280_SCL 22

// Define serial debug output baud rate
#define SERIAL_BAUD 115200

// Create a BME280 object
Adafruit_BME280 bme;

void setup() {
  // Initialize serial debug output
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    // Wait for serial connection to establish
  }

  // Initialize I2C
  Wire.begin(BME280_SDA, BME280_SCL);

  // Initialize BME280
  if (!bme.begin(BME280_ADDRESS)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }

  Serial.println("BME280 initialized");
}

void loop() {
  // Read temperature from BME280
  float temperature = bme.readTemperature();

  // Check for errors
  if (isnan(temperature)) {
    Serial.println("Failed to read temperature");
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
  }

  // Wait for 1 second before reading again
  delay(1000);
}