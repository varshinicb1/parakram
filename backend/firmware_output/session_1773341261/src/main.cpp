#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

// Define the pin for the NeoPixel strip
#define NEOPIXEL_PIN 17

// Define the number of pixels in the strip
#define NUM_PIXELS 30

// Define the NeoPixel object
Adafruit_NeoPixel pixels(NUM_PIXELS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

// Function to generate a color based on a position in the rainbow
uint32_t Wheel(byte pos) {
  if (pos < 85) {
    // Red to green
    return pixels.Color(pos * 3, 255 - pos * 3, 0);
  } else if (pos < 170) {
    // Green to blue
    pos -= 85;
    return pixels.Color(0, 255 - pos * 3, pos * 3);
  } else {
    // Blue to red
    pos -= 170;
    return pixels.Color(pos * 3, 0, 255 - pos * 3);
  }
}

void setup() {
  // Initialize the serial communication for debug output
  Serial.begin(115200);
  while (!Serial) {
    // Wait for serial port to connect
  }
  Serial.println("Setup started");

  // Initialize the NeoPixel strip
  pixels.begin();
  pixels.setBrightness(50); // Set the brightness to 50%

  // Check if the NeoPixel strip is initialized correctly
  if (!pixels.canShow()) {
    Serial.println("NeoPixel strip initialization failed");
    while (1) {
      // Infinite loop if initialization fails
    }
  }

  Serial.println("Setup completed");
}

void loop() {
  // Create a rainbow animation
  for (int i = 0; i < NUM_PIXELS; i++) {
    // Calculate the color for each pixel based on its position
    uint32_t color = Wheel((i * 256 / NUM_PIXELS));
    pixels.setPixelColor(i, color);
  }
  pixels.show(); // Show the updated pixel colors

  // Delay for 50ms to control the animation speed
  delay(50);
}