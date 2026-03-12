#include <Arduino.h>
#include "config.h"
#include <Adafruit_NeoPixel.h>

#define NEOPIXEL_PIN 18
#define NUM_LEDS 30

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
    Serial.begin(115200);
    if (!strip.begin()) {
        Serial.println("Failed to initialize NeoPixel strip!");
        while (true);
    }
    strip.show(); // Initialize all pixels to 'off'
}

void loop() {
    rainbowAnimation();
}

void rainbowAnimation() {
    static uint8_t hue = 0;
    for(int i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, Wheel((i * 256 / strip.numPixels()) + hue));
    }
    strip.show();
    hue++;
    delay(20);
}

uint32_t Wheel(byte WheelPos) {
    if(WheelPos < 85) {
        return strip.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
    } else if(WheelPos < 170) {
        WheelPos -= 85;
        return strip.Color(255 - WheelPos * 3, 0, WheelPos * 3);
    } else {
        WheelPos -= 170;
        return strip.Color(0, WheelPos * 3, 255 - WheelPos * 3);
    }
}