#include <Servo.h>
#include "config.h"

#define SERVO_PIN 9

Servo myservo;  // create servo object to control a servo

void setup() {
  Serial.begin(9600);
  
  // Attach the servo on pin 9 to the servo object:
  myservo.attach(SERVO_PIN);

  Serial.println("Servo Sweep Example");
}

void loop() {
  // Sweep from 0 degrees to 180 degrees
  for (int pos = 0; pos <= 180; pos += 1) { 
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }

  // Sweep from 180 degrees to 0 degrees
  for (int pos = 180; pos >= 0; pos -= 1) { 
    myservo.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
}