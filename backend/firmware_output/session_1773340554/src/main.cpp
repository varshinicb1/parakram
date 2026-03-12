#include <Arduino.h> // Include the Arduino library for standard API
#include <ESP32Servo.h> // Include the ESP32Servo library for servo control

// Define the servo pin
#define SERVO_PIN 9

// Define the servo object
Servo myServo;

void setup() {
  // Initialize the serial communication at 9600 bps
  Serial.begin(9600);
  Serial.println("Setup started");

  // Attach the servo to the defined pin
  // This will configure the pin as an output and prepare the servo for use
  myServo.attach(SERVO_PIN);
  Serial.println("Servo attached");

  // Initialize the servo to 0 degrees
  myServo.write(0);
  delay(1000); // Wait for 1 second to ensure the servo has moved to the initial position
}

void loop() {
  // Sweep the servo from 0 to 180 degrees
  for (int angle = 0; angle <= 180; angle++) {
    // Write the current angle to the servo
    myServo.write(angle);
    Serial.print("Angle: ");
    Serial.println(angle);

    // Wait for 15 milliseconds to control the speed of the sweep
    delay(15);
  }

  // Wait for 1 second before sweeping back to 0 degrees
  delay(1000);

  // Sweep the servo from 180 to 0 degrees
  for (int angle = 180; angle >= 0; angle--) {
    // Write the current angle to the servo
    myServo.write(angle);
    Serial.print("Angle: ");
    Serial.println(angle);

    // Wait for 15 milliseconds to control the speed of the sweep
    delay(15);
  }

  // Wait for 1 second before repeating the sweep
  delay(1000);
}