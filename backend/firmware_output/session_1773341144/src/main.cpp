#include <Arduino.h>
#include <Wire.h>           // For I2C communication
#include <Adafruit_SSD1306.h> // For OLED display
#include <Adafruit_BME280.h>  // For BME280 sensor
#include <WiFi.h>          // For WiFi connectivity
#include "config.h"       // Include the config file

// Define OLED display
Adafruit_SSD1306 display = Adafruit_SSD1306(128, 64, &Wire);

// Define BME280 sensor
Adafruit_BME280 bme;

// WiFi connection variables
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);

  // Initialize I2C communication
  Wire.begin(BME280_SDA, BME280_SCL);

  // Initialize OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Initialize BME280 sensor
  if (!bme.begin(BME280_ADDRESS)) {
    Serial.println(F("Could not find a valid BME280 sensor, check wiring!"));
    while (1);
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.println("Initializing BME280 sensor...");

  // Set up BME280 sensor
  bme.setSampling(Adafruit_BME280::MODE_NORMAL, 
                   Adafruit_BME280::SAMPLING_X1, 
                   Adafruit_BME280::SAMPLING_X1, 
                   Adafruit_BME280::SAMPLING_X1, 
                   Adafruit_BME280::FILTER_X16,
                   Adafruit_BME280::STANDBY_MS_0_5);

  Serial.println("BME280 sensor initialized");
}

void loop() {
  // Read sensor data
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0F;

  // Display sensor data on OLED display
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0,0);
  display.print("Temperature: ");
  display.print(temperature);
  display.print(" C");
  display.setCursor(0,10);
  display.print("Humidity: ");
  display.print(humidity);
  display.print(" %");
  display.setCursor(0,20);
  display.print("Pressure: ");
  display.print(pressure);
  display.print(" hPa");
  display.display();

  // Print sensor data to serial console
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  Serial.print("Pressure: ");
  Serial.print(pressure);
  Serial.println(" hPa");

  delay(1000);
}