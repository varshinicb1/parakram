#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h"  // Include the config.h file

// Define MQTT client and WiFi client
WiFiClient espClient;
PubSubClient client(espClient);

// Define sensor data
const int sensorPin = 32;  // ADC1 pin
volatile int sensorValue = 0;

// Reconnect to MQTT broker
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// Define setup function
void setup() {
  // Initialize serial communication
  Serial.begin(SERIAL_BAUD);
  while (!Serial) {
    // Wait for serial port to connect
  }
  Serial.println("ESP32 MQTT Client");

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Set up MQTT client
  client.setServer(MQTT_BROKER, MQTT_PORT);
}

// Define loop function
void loop() {
  // Read sensor data
  sensorValue = analogRead(sensorPin);
  Serial.print("Sensor value: ");
  Serial.println(sensorValue);

  // Publish sensor data to MQTT topic
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Publish sensor data every 5 seconds
  static unsigned long lastPublishTime = 0;
  if (millis() - lastPublishTime >= 5000) {
    lastPublishTime = millis();
    char message[8];
    itoa(sensorValue, message, 10);
    client.publish(MQTT_TOPIC, message);
    Serial.println("Published sensor data to MQTT topic");
  }
}