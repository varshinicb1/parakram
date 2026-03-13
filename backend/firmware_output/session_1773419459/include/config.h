// Define sensor pins
#define SENSOR1_PIN 32  // ADC1 channel 4
#define SENSOR2_PIN 33  // ADC1 channel 5

// Define task priorities
#define SENSOR_TASK_PRIORITY 1
#define SERIAL_TASK_PRIORITY 2

// Define task stack sizes
#define SENSOR_TASK_STACK_SIZE 2048
#define SERIAL_TASK_STACK_SIZE 2048