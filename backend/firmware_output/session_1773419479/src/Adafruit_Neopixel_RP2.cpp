#include <Adafruit_NeoPixel.h>
#include <pio.h>
#include <hardware/clocks.h>

// ... (rest of the file remains the same)

void Adafruit_NeoPixel_RP2::begin() {
  // ... (rest of the function remains the same)

  // Claim a state machine and add the WS2812 program
  sm_config = pio_add_program(pio, &ws2812_program);
  sm = pio_claim_unused_sm(pio, true);
  pio_sm_config c = ws2812_program_get_default_config(sm_config);
  sm_config_set_out_shift(&c, false, true, 0);
  sm_config_set_sideset(&c, 1, false, false);
  pio_sm_init(pio, sm, sm_config, &c);
  pio_sm_set_enabled(pio, sm, true);

  // ... (rest of the function remains the same)
}

void Adafruit_NeoPixel_RP2::end() {
  // ... (rest of the function remains the same)

  // Remove the program and unclaim the state machine
  pio_remove_program(pio, &ws2812_program, sm);
  pio_sm_unclaim(pio, sm);

  // ... (rest of the function remains the same)
}