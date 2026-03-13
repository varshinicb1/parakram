#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include "config.h" // Include the config.h file

// Define MQTT client and WiFi client
WiFiClient espClient;
PubSubClient client(espClient);

// Define sensor data
const int sensorPin = 32;  // ADC1 pin
int sensorValue = 0;

// Define WiFi and MQTT connection variables
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;
const char* mqttServer = MQTT_BROKER;
const int mqttPort = MQTT_PORT;
const char* mqttTopic = MQTT_TOPIC;
const char* clientId = MQTT_CLIENT_ID;

// Define connection status
bool wifiConnected = false;
bool mqttConnected = false;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  Serial.println("Starting MQTT client...");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  wifiConnected = true;

  // Connect to MQTT broker
  client.setServer(mqttServer, mqttPort);
  while (!client.connected()) {
    Serial.println("Connecting to MQTT broker...");
    if (client.connect(clientId)) {
      Serial.println("Connected to MQTT broker");
      mqttConnected = true;
    } else {
      delay(5000);
    }
  }
}

void loop() {
  // Read sensor data
  sensorValue = analogRead(sensorPin);
  Serial.print("Sensor value: ");
  Serial.println(sensorValue);

  // Publish sensor data to MQTT topic
  if (mqttConnected) {
    char messageBuffer[8];
    itoa(sensorValue, messageBuffer, 10);
    client.publish(mqttTopic, messageBuffer);
    Serial.println("Published sensor data to MQTT topic");
  }

  // Check for MQTT connection
  if (!client.connected()) {
    mqttConnected = false;
    Serial.println("Disconnected from MQTT broker");
    while (!client.connected()) {
      Serial.println("Reconnecting to MQTT broker...");
      if (client.connect(clientId)) {
        Serial.println("Reconnected to MQTT broker");
        mqttConnected = true;
      } else {
        delay(5000);
      }
    }
  }

  // Delay between sensor readings
  delay(1000);
}