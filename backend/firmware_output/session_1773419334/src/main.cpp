#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>

// Include configuration file
#include "config.h"

// Define WiFi credentials
const char* ssid = "your_ssid";
const char* password = "your_password";

// Initialize BME280 sensor
Adafruit_BME280 bme(BME280_ADDRESS);

// Initialize OLED display
Adafruit_SSD1306 display(OLED_WIDTH, OLED_HEIGHT, &Wire, OLED_RESET);

// Flag for WiFi connection status
volatile bool wifiConnected = false;

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);

  // Initialize I2C communication
  Wire.begin(BME280_SDA, BME280_SCL);

  // Initialize BME280 sensor
  if (!bme.begin()) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }

  // Initialize OLED display
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    while (1);
  }

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  wifiConnected = true;

  // Display initialization message on OLED
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Weather Station");
  display.display();
}

void loop() {
  // Check if WiFi is connected
  if (wifiConnected) {
    // Read temperature, humidity, and pressure from BME280 sensor
    float temperature = bme.readTemperature();
    float humidity = bme.readHumidity();
    float pressure = bme.readPressure() / 100.0F;

    // Display sensor readings on OLED
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 0);
    display.print("Temp: ");
    display.print(temperature);
    display.println(" C");
    display.print("Hum: ");
    display.print(humidity);
    display.println(" %");
    display.print("Pres: ");
    display.print(pressure);
    display.println(" hPa");
    display.display();

    // Print sensor readings to serial console
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println(" C");
    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
    Serial.print("Pressure: ");
    Serial.print(pressure);
    Serial.println(" hPa");
  } else {
    Serial.println("WiFi connection lost");
  }

  delay(1000);
}