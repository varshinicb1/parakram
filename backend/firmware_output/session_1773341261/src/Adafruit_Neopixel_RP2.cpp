#include <Adafruit_NeoPixel.h>
#include <hardware/pio.h>
#include <hardware/clocks.h>

// Define the PIO program for the NeoPixel strip
const uint16_t neo_pixel_program_instructions[] = {
    // Set the pin high
    pio_encode_set(pio_x, 1),
    // Wait for 1 cycle
    pio_encode_wait_gpio(pio_x, true),
    // Set the pin low
    pio_encode_set(pio_x, 0),
    // Wait for 1 cycle
    pio_encode_wait_gpio(pio_x, false),
    // Repeat the sequence
    pio_encode_set(pio_x, 1),
    // Wait for 1 cycle
    pio_encode_wait_gpio(pio_x, true),
    // Set the pin low again
    pio_encode_set(pio_x, 0),
    // Wait for 1 cycle
    pio_encode_wait_gpio(pio_x, false),
};

// Define the PIO program offset
const uint16_t neo_pixel_program_offset = pio_add_program(pio0, neo_pixel_program_instructions);

// Define the state machine configuration
const pio_sm_config neo_pixel_sm_config = {
    // Set the program offset
    .program = neo_pixel_program_offset,
    // Set the clock divider
    .clock_div = 4,
    // Set the wrap target
    .wrap_target = pio_encode_wrap_target(0),
    // Set the wrap
    .wrap = pio_encode_wrap(0),
    // Set the out shift
    .out_shift = true,
    // Set the out base
    .out_base = pio0,
    // Set the in shift
    .in_shift = false,
    // Set the in base
    .in_base = pio0,
};

// Initialize the state machine
void Adafruit_NeoPixel_RP2::begin() {
    // Initialize the PIO
    pio_init(pio0);
    // Claim a state machine
    sm = pio_claim_unused_sm(pio0, true);
    // Initialize the state machine configuration
    pio_sm_init(pio0, sm, neo_pixel_program_offset, &neo_pixel_sm_config);
    // Set the state machine clock divider
    pio_sm_set_clkdiv(pio0, sm, 4);
    // Set the state machine enabled
    pio_sm_set_enabled(pio0, sm, true);
}

// Uninitialize the state machine
void Adafruit_NeoPixel_RP2::end() {
    // Set the state machine disabled
    pio_sm_set_enabled(pio0, sm, false);
    // Unclaim the state machine
    pio_sm_unclaim(pio0, sm);
    // Uninitialize the PIO
    pio_deinit(pio0);
}