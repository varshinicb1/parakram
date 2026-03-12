#ifndef BME280_H
#define BME280_H

#include <Wire.h>

bool bme280_setup(uint8_t i2c_address);
float bme280_read_temperature();

#endif // BME280_H