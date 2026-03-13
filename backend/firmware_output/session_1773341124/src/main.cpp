// Import necessary libraries
#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

// Define BME280 I2C address
#define BME280_ADDRESS 0x76

// Define I2C pins
#define SCL_PIN 22
#define SDA_PIN 21

// Define serial baud rate
#define SERIAL_BAUD 115200

// Create a BME280 object
Adafruit_BME280 bme;

void setup() {
  // Initialize serial communication
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    // Wait for serial connection
  }

  // Initialize I2C communication
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize BME280 sensor
  if (!bme.begin(BME280_ADDRESS)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1) {
      // If sensor is not found, loop indefinitely
    }
  }

  Serial.println("BME280 sensor initialized");
}

void loop() {
  // Read temperature from BME280 sensor
  float temperature = bme.readTemperature();

  // Check for errors
  if (isnan(temperature)) {
    Serial.println("Failed to read temperature");
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
  }

  // Wait for 1 second before taking the next reading
  delay(1000);
}