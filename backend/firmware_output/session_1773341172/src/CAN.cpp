#include "CAN.h"

CAN::CAN(PinName rx, PinName tx) {
  // Configure GPIO for CAN pins
  GPIO_InitTypeDef gpioInit;
  gpioInit.Pin = rx;
  gpioInit.Mode = GPIO_MODE_AF_PP;
  gpioInit.Pull = GPIO_NOPULL;
  gpioInit.Speed = GPIO_SPEED_FREQ_HIGH;
  gpioInit.Alternate = GPIO_AF9_CAN1;
  HAL_GPIO_Init(GPIOB, &gpioInit);

  gpioInit.Pin = tx;
  HAL_GPIO_Init(GPIOB, &gpioInit);

  // Initialize CAN handle
  hcan.Instance = CAN1;
  hcan.Init.Prescaler = 2;  // 45 MHz / 2 = 22.5 MHz
  hcan.Init.GTP = 1;
  hcan.Init.GTPseg1 = 2;
  hcan.Init.GTPseg2 = 2;
  hcan.Init.BS1 = 10;
  hcan.Init.BS2 = 2;
  hcan.Init.SJW = 1;
  hcan.Init.JumpWidth = 1;
  hcan.Init.TimeSeg1 = 10;
  hcan.Init.TimeSeg2 = 2;
  hcan.Init.TimeTriggeredMode = DISABLE;
  hcan.Init.AutoBusOff = DISABLE;
  hcan.Init.AutoWakeUp = DISABLE;
  hcan.Init.AutoRetransmission = DISABLE;
  hcan.Init.ReceiveFifoLocked = DISABLE;
  hcan.Init.TransmitFifoPriority = DISABLE;

  HAL_CAN_Init(&hcan);
}

void CAN::begin(int baudRate) {
  // Configure CAN baud rate
  hcan.Init.Prescaler = (uint16_t)((45 * 1000000) / (2 * baudRate));
  HAL_CAN_Init(&hcan);
}

bool CAN::read(uint32_t& id, uint8_t* data, uint8_t& length) {
  CAN_RxHeader rxHeader;
  uint8_t rxData[8];

  if (HAL_CAN_Receive(&hcan, CAN_FIFO0, &rxHeader, rxData, 100) == HAL_OK) {
    id = rxHeader.StdId;
    length = rxHeader.DLC;
    for (int i = 0; i < length; i++) {
      data[i] = rxData[i];
    }
    return true;
  }
  return false;
}