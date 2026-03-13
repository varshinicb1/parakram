#ifndef CAN_H
#define CAN_H

#include "mbed.h"

class CAN {
public:
  CAN(PinName rx, PinName tx);
  void begin(int baudRate);
  bool read(uint32_t& id, uint8_t* data, uint8_t& length);

private:
  CAN_HandleTypeDef hcan;
};

#endif  // CAN_H