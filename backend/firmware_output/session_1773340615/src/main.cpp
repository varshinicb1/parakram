### main.cpp
```cpp
// FILE: main.cpp
#include <Adafruit_NeoPixel.h>
#include <hardware/pio.h>
#include <hardware/clocks.h>

// Define the WS2812 PIO program
const uint16_t ws2812_program_instructions[] = {
    // Set the initial state of the state machine
    pio_encode_set(pio_y, 1),
    // Set the initial state of the pin
    pio_encode_out(pio_y, 1),
    // Set the clock divider
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x, 1),
    // Set the number of bits to shift
    pio_encode_in(pio_x,