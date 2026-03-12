#include <Arduino.h>
#include <WiFi.h>

// Define the WiFi credentials
const char* ssid = "your_ssid";
const char* password = "your_password";

void setup() {
  // Initialize the serial communication
  Serial.begin(115200);

  // Connect to the WiFi network
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Put your main code here
  delay(1000);
}