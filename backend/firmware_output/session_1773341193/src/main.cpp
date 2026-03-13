// Import the necessary libraries for the Arduino framework
#include <Arduino.h>
// Import the Servo library for controlling the servo motor
#include <Servo.h>

// Define the pin for the servo motor
#define SERVO_PIN 9

// Create a Servo object to control the servo motor
Servo servo;

void setup() {
  // Initialize the serial communication at 9600 baud rate for debug output
  Serial.begin(9600);
  // Initialize the servo motor
  servo.attach(SERVO_PIN); // Attach the servo to the defined pin
  // Wait for 1 second to ensure the servo is initialized
  delay(1000);
  Serial.println("Servo sweep started");
}

void loop() {
  // Sweep the servo from 0 to 180 degrees
  for (int angle = 0; angle <= 180; angle++) {
    // Set the servo angle
    servo.write(angle); // Write the angle to the servo
    // Wait for 15 milliseconds to allow the servo to move to the new position
    delay(15);
    // Print the current angle to the serial monitor for verification
    Serial.print("Angle: ");
    Serial.println(angle);
  }
  // Wait for 1 second before sweeping the servo back to 0 degrees
  delay(1000);
  // Sweep the servo from 180 to 0 degrees
  for (int angle = 180; angle >= 0; angle--) {
    // Set the servo angle
    servo.write(angle); // Write the angle to the servo
    // Wait for 15 milliseconds to allow the servo to move to the new position
    delay(15);
    // Print the current angle to the serial monitor for verification
    Serial.print("Angle: ");
    Serial.println(angle);
  }
  // Wait for 1 second before repeating the servo sweep
  delay(1000);
}