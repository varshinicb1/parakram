#include <Arduino.h>
#include <Adafruit_NeoPixel.h>
#include <pio.h>
#include <hardware/clocks.h>

// Define the pin used for NeoPixel data
#define NEOPIXEL_PIN 17

// Define the number of NeoPixels
#define NUM_PIXELS 30

// Define the NeoPixel object
Adafruit_NeoPixel pixels(NUM_PIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  // Initialize serial communication for debug output
  Serial.begin(115200);
  Serial.println("Setup started");

  // Initialize the NeoPixel object
  pixels.begin();
  // Set the brightness of the NeoPixels
  pixels.setBrightness(50);

  Serial.println("Setup completed");
}

void loop() {
  // Create a rainbow animation
  for (int i = 0; i < NUM_PIXELS; i++) {
    // Calculate the hue value for the current pixel
    uint16_t hue = (i * 256) / NUM_PIXELS;
    // Set the color of the current pixel
    pixels.setPixelColor(i, pixels.ColorHSV(hue, 255, 255));
  }
  // Show the updated pixel colors
  pixels.show();

  // Delay for 50ms to control the animation speed
  delay(50);

  // Increment the hue value for the next frame
  static uint16_t hue = 0;
  hue += 256;
  if (hue > 5 * 256) {
    hue = 0;
  }

  // Print the current frame number for verification
  static uint32_t frame = 0;
  frame++;
  Serial.print("Frame: ");
  Serial.println(frame);
}