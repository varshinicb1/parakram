#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <freertos/semphr.h>
#include <driver/adc.h>  // Added this line
#include "config.h"

// Define a semaphore for task synchronization
SemaphoreHandle_t sensorSemaphore;

// Define a queue for sensor data
QueueHandle_t sensorQueue;

// Sensor task function
void sensorTask(void *pvParameter) {
  // Initialize ADC
  adc1_config_width(ADC_BIT_WIDTH_12);
  adc1_config_channel_atten(ADC_CHANNEL_4, ADC_ATTEN_0db);  // Sensor 1
  adc1_config_channel_atten(ADC_CHANNEL_5, ADC_ATTEN_0db);  // Sensor 2

  while (1) {
    // Read sensor values
    int sensor1Value = adc1_get_raw(ADC_CHANNEL_4);
    int sensor2Value = adc1_get_raw(ADC_CHANNEL_5);

    // Send sensor values to the queue
    xQueueSend(sensorQueue, &sensor1Value, portMAX_DELAY);
    xQueueSend(sensorQueue, &sensor2Value, portMAX_DELAY);

    // Give a semaphore to signal that data is available
    xSemaphoreGive(sensorSemaphore);

    // Wait for 100ms before taking the next reading
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

// Serial task function
void serialTask(void *pvParameter) {
  while (1) {
    // Wait for the semaphore to be given
    if (xSemaphoreTake(sensorSemaphore, portMAX_DELAY) == pdTRUE) {
      // Receive sensor values from the queue
      int sensor1Value;
      int sensor2Value;
      xQueueReceive(sensorQueue, &sensor1Value, portMAX_DELAY);
      xQueueReceive(sensorQueue, &sensor2Value, portMAX_DELAY);

      // Print sensor values to the serial console
      Serial.print("Sensor 1: ");
      Serial.print(sensor1Value);
      Serial.print(", Sensor 2: ");
      Serial.println(sensor2Value);
    }
  }
}

void setup() {
  // Initialize serial communication
  Serial.begin(115200);

  // Create a queue for sensor data
  sensorQueue = xQueueCreate(10, sizeof(int));

  // Create a semaphore for task synchronization
  sensorSemaphore = xSemaphoreCreateBinary();

  // Create tasks
  xTaskCreate(sensorTask, "Sensor Task", SENSOR_TASK_STACK_SIZE, NULL, SENSOR_TASK_PRIORITY, NULL);
  xTaskCreate(serialTask, "Serial Task", SERIAL_TASK_STACK_SIZE, NULL, SERIAL_TASK_PRIORITY, NULL);
}

void loop() {
  // Do nothing, tasks are running in the background
}