#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include "config.h" // Include the config.h file

// Define OLED display
Adafruit_SSD1306 display = Adafruit_SSD1306(128, 64, &Wire);

// Define BME280 sensor
Adafruit_BME280 bme;

// WiFi connection status
volatile bool wifiConnected = false;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);

  // Initialize I2C communication
  Wire.begin(BME280_SDA, BME280_SCL);

  // Initialize OLED display
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C); // Address 0x3C for most OLED displays
  display.display();
  delay(1000);

  // Initialize BME280 sensor
  if (!bme.begin(BME280_ADDRESS)) {
    Serial.println("Could not find a valid BME280 sensor, check wiring!");
    while (1);
  }

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  wifiConnected = true;

  // Print WiFi connection details
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read BME280 sensor data
  float temperature = bme.readTemperature();
  float humidity = bme.readHumidity();
  float pressure = bme.readPressure() / 100.0F;

  // Display sensor data on OLED display
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Temperature: " + String(temperature) + " C");
  display.println("Humidity: " + String(humidity) + " %");
  display.println("Pressure: " + String(pressure) + " hPa");
  display.display();

  // Print sensor data to serial console
  Serial.println("Temperature: " + String(temperature) + " C");
  Serial.println("Humidity: " + String(humidity) + " %");
  Serial.println("Pressure: " + String(pressure) + " hPa");

  // Wait for 1 second before reading sensor data again
  delay(1000);
}