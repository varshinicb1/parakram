#include <Arduino.h>
#include <Wire.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include "config.h"

// Define the tasks
TaskHandle_t sensor1Task;
TaskHandle_t sensor2Task;

// Define the sensor data
volatile int sensor1Data = 0;
volatile int sensor2Data = 0;

// Function prototypes
void sensor1TaskFunction(void *pvParameter);
void sensor2TaskFunction(void *pvParameter);

void setup() {
  // Initialize serial communication for debugging
  Serial.begin(115200);
  while (!Serial) {
    // Wait for serial port to be available
  }

  // Initialize I2C communication
  Wire.begin(SDA_PIN, SCL_PIN);
  Wire.setClock(100000); // Set I2C clock speed to 100 kHz

  // Create tasks
  xTaskCreate(sensor1TaskFunction, "Sensor 1 Task", TASK_STACK_SIZE, NULL, TASK_PRIORITY, &sensor1Task);
  xTaskCreate(sensor2TaskFunction, "Sensor 2 Task", TASK_STACK_SIZE, NULL, TASK_PRIORITY, &sensor2Task);
}

void loop() {
  // Main loop does not do much in this example, as tasks handle the work
  Serial.println("Main loop running...");
  delay(1000);
}

void sensor1TaskFunction(void *pvParameter) {
  // Initialize sensor 1
  Wire.beginTransmission(SENSOR1_ADDRESS);
  Wire.write(0x00); // Send register address
  Wire.endTransmission();

  for (;;) {
    // Read sensor 1 data
    Wire.requestFrom(SENSOR1_ADDRESS, 2);
    if (Wire.available() == 2) {
      sensor1Data = Wire.read() << 8 | Wire.read();
      Serial.print("Sensor 1 data: ");
      Serial.println(sensor1Data);
    } else {
      Serial.println("Error reading sensor 1 data");
    }

    // Delay between readings
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}

void sensor2TaskFunction(void *pvParameter) {
  // Initialize sensor 2
  Wire.beginTransmission(SENSOR2_ADDRESS);
  Wire.write(0x00); // Send register address
  Wire.endTransmission();

  for (;;) {
    // Read sensor 2 data
    Wire.requestFrom(SENSOR2_ADDRESS, 2);
    if (Wire.available() == 2) {
      sensor2Data = Wire.read() << 8 | Wire.read();
      Serial.print("Sensor 2 data: ");
      Serial.println(sensor2Data);
    } else {
      Serial.println("Error reading sensor 2 data");
    }

    // Delay between readings
    vTaskDelay(1000 / portTICK_PERIOD_MS);
  }
}