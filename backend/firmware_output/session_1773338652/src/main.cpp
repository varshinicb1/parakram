#include <Servo.h>
#include <Arduino.h>

#define SERVO_PIN 9

Servo myservo;  // create servo object to control a servo

void setup() {
  Serial.begin(9600);  // initialize serial communication at 9600 bits per second:
  myservo.attach(SERVO_PIN);  // attaches the servo on pin 9 to the servo object
}

void loop() {
  for (int pos = 0; pos <= 180; pos += 1) {  // goes from 0 degrees to 180 degrees
    myservo.write(pos);                    // tell servo to go to position in variable 'pos'
    delay(15);                             // waits 15ms for the servo to reach the position
  }
  for (int pos = 180; pos >= 0; pos -= 1) {  // goes from 180 degrees to 0 degrees
    myservo.write(pos);                    // tell servo to go to position in variable 'pos'
    delay(15);                             // waits 15ms for the servo to reach the position
  }
}