#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_BME280.h>

// Define BME280 I2C address
#define BME280_ADDRESS 0x76

// Define BME280 pins
#define SCL_PIN 22
#define SDA_PIN 21

// Create a BME280 object
Adafruit_BME280 bme;

void setup() {
  // Initialize serial communication at 115200 baud
  Serial.begin(115200);
  while (!Serial) {
    // Wait for serial port to be available
  }

  // Initialize I2C communication
  Wire.begin(SDA_PIN, SCL_PIN);

  // Initialize BME280 sensor
  if (!bme.begin(BME280_ADDRESS)) {
    // If BME280 initialization fails, print error message and halt
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }

  // Print BME280 sensor details
  Serial.println("BME280 Sensor Details:");
  Serial.print("Chip ID: 0x");
  Serial.println(bme.chipID(), HEX);
  Serial.print("Device ID: 0x");
  Serial.println(bme.sensorID(), HEX);
}

void loop() {
  // Read temperature from BME280 sensor
  float temperature = bme.readTemperature();

  // Check if temperature reading is valid
  if (isnan(temperature)) {
    // If temperature reading is invalid, print error message
    Serial.println("Failed to read temperature from BME280 sensor!");
  } else {
    // Print temperature reading
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" *C");
  }

  // Wait for 1 second before taking the next reading
  delay(1000);
}