#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Include configuration settings
#include "config.h"

// Define pins
#define LED_PIN 2  // Built-in LED pin

// Define MQTT client
WiFiClient espClient;
PubSubClient client(espClient);

// Define sensor data
const char* sensorData = "Sensor data";

// Define connection timeout
const unsigned long connectionTimeout = 10000;  // 10 seconds

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("Starting setup...");

  // Initialize LED pin as output
  pinMode(LED_PIN, OUTPUT);

  // Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < connectionTimeout) {
    Serial.print(".");
    delay(100);
  }
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Failed to connect to WiFi");
    while (true) {
      // Handle connection failure
      digitalWrite(LED_PIN, HIGH);
      delay(500);
      digitalWrite(LED_PIN, LOW);
      delay(500);
    }
  }
  Serial.println("Connected to WiFi");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Set up MQTT client
  client.setServer(MQTT_BROKER, MQTT_PORT);
}

void loop() {
  // Check if MQTT client is connected
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // Publish sensor data
  char message[50];
  sprintf(message, "{\"sensorData\": \"%s\"}", sensorData);
  if (client.connected()) {
    client.publish(MQTT_TOPIC, message);
  }

  // Delay between publishes
  delay(1000);
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(MQTT_CLIENT_ID)) {
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