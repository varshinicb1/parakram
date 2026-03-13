#include <Arduino.h>  // Include Arduino framework
#include <Servo.h>  // Include servo library
#include "config.h"  // Include configuration defines

// Define servo object
Servo servo;

void setup() {
  // Initialize serial communication for debug output
  Serial.begin(9600);
  Serial.println("Servo Sweep Firmware Started");

  // Attach servo to defined pin
  // The servo library uses PWM signals to control the servo
  servo.attach(SERVO_PIN);
  Serial.println("Servo attached to pin " + String(SERVO_PIN));
}

void loop() {
  // Sweep servo from minimum to maximum angle
  for (int angle = SERVO_MIN_ANGLE; angle <= SERVO_MAX_ANGLE; angle++) {
    // Set servo angle
    servo.write(angle);
    Serial.print("Servo angle: ");
    Serial.println(angle);
    // Delay to control speed of servo sweep
    delay(SERVO_SWEEP_DELAY);
  }

  // Sweep servo back from maximum to minimum angle
  for (int angle = SERVO_MAX_ANGLE; angle >= SERVO_MIN_ANGLE; angle--) {
    // Set servo angle
    servo.write(angle);
    Serial.print("Servo angle: ");
    Serial.println(angle);
    // Delay to control speed of servo sweep
    delay(SERVO_SWEEP_DELAY);
  }
}