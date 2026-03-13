// Include necessary libraries
#include <Arduino.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <config.h>

// Define task handles
TaskHandle_t sensor1TaskHandle = NULL;
TaskHandle_t sensor2TaskHandle = NULL;

// Define sensor reading variables
volatile int sensor1Reading = 0;
volatile int sensor2Reading = 0;

// Sensor 1 task function
void sensor1Task(void *pvParameter) {
  // Initialize ADC1 channel 4 (GPIO32)
  // Set ADC1 channel 4 as input
  pinMode(SENSOR1_PIN, INPUT);
  
  while (1) {
    // Read sensor 1 value using ADC1
    sensor1Reading = analogRead(SENSOR1_PIN);
    
    // Print sensor 1 reading to serial console
    Serial.print("Sensor 1 reading: ");
    Serial.println(sensor1Reading);
    
    // Delay for 100ms
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

// Sensor 2 task function
void sensor2Task(void *pvParameter) {
  // Initialize ADC1 channel 5 (GPIO33)
  // Set ADC1 channel 5 as input
  pinMode(SENSOR2_PIN, INPUT);
  
  while (1) {
    // Read sensor 2 value using ADC1
    sensor2Reading = analogRead(SENSOR2_PIN);
    
    // Print sensor 2 reading to serial console
    Serial.print("Sensor 2 reading: ");
    Serial.println(sensor2Reading);
    
    // Delay for 100ms
    vTaskDelay(pdMS_TO_TICKS(100));
  }
}

void setup() {
  // Initialize serial communication at 115200 baudrate
  Serial.begin(SERIAL_BAUDRATE);
  
  // Create sensor 1 task
  xTaskCreate(sensor1Task, "Sensor 1 Task", TASK_STACK_SIZE, NULL, TASK_PRIORITY, &sensor1TaskHandle);
  
  // Create sensor 2 task
  xTaskCreate(sensor2Task, "Sensor 2 Task", TASK_STACK_SIZE, NULL, TASK_PRIORITY, &sensor2TaskHandle);
}

void loop() {
  // Do nothing in the loop function, as tasks are running in the background
}