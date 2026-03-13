#include <Arduino.h>
#include "config.h"
#include "stm32f4xx_hal.h"

// Define the CAN handle
CAN_HandleTypeDef hcan;

// Define the serial handle
UART_HandleTypeDef huart;

// Define the CAN filter structure
CAN_FilterTypeDef sFilterConfig;

// Define the CAN message structure
CanRxMsg rxMessage;

// Flag to indicate if the CAN bus is initialized
volatile bool canInitialized = false;

void setup() {
  // Initialize the serial communication
  Serial.begin(SERIAL_BAUD_RATE);
  while (!Serial) {
    // Wait for serial communication to be established
  }

  // Initialize the GPIO pins for CAN communication
  GPIO_InitTypeDef CAN_GPIO_InitStruct;
  CAN_GPIO_InitStruct.Pin = CAN_RX_PIN | CAN_TX_PIN;
  CAN_GPIO_InitStruct.Mode = GPIO_MODE_AF_PP;
  CAN_GPIO_InitStruct.Pull = GPIO_NOPULL;
  CAN_GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_HIGH;
  CAN_GPIO_InitStruct.Alternate = GPIO_AF9_CAN1;
  HAL_GPIO_Init(GPIOB, &CAN_GPIO_InitStruct);

  // Initialize the CAN bus
  hcan.Instance = CAN1;
  hcan.Init.Prescaler = 2;  // Prescaler value
  hcan.Init.Mode = CAN_MODE_NORMAL;
  hcan.Init.SyncJumpWidth = CAN_SYNC_JUMP_WIDTH_1;
  hcan.Init.TimeSeg1 = CAN_TIMESEG1_13;
  hcan.Init.TimeSeg2 = CAN_TIMESEG2_2;
  hcan.Init.TimeTriggeredMode = DISABLE;
  hcan.Init.AutoBusOff = DISABLE;
  hcan.Init.AutoWakeUp = DISABLE;
  hcan.Init.AutoRetransmission = DISABLE;
  hcan.Init.ReceiveFifoLocked = DISABLE;
  hcan.Init.TransmitFifoPriority = DISABLE;

  if (HAL_CAN_Init(&hcan) != HAL_OK) {
    Serial.println("CAN bus initialization failed");
    while (1) {
      // Infinite loop if CAN bus initialization fails
    }
  }

  // Configure the CAN filter
  sFilterConfig.FilterNumber = 0;
  sFilterConfig.FilterMode = CAN_FILTERMODE_IDMASK;
  sFilterConfig.FilterType = CAN_FILTERTYPE_REMOTE;
  sFilterConfig.FilterIdHigh = 0x0000;
  sFilterConfig.FilterIdLow = 0x0000;
  sFilterConfig.FilterMaskIdHigh = 0x0000;
  sFilterConfig.FilterMaskIdLow = 0x0000;
  sFilterConfig.FilterFIFOAssignment = CAN_RX_FIFO0;
  sFilterConfig.FilterActivation = ENABLE;

  if (HAL_CAN_ConfigFilter(&hcan, &sFilterConfig) != HAL_OK) {
    Serial.println("CAN filter configuration failed");
    while (1) {
      // Infinite loop if CAN filter configuration fails
    }
  }

  canInitialized = true;
}

void loop() {
  if (canInitialized) {
    // Check if there are any messages in the CAN receive FIFO
    if (HAL_CAN_GetRxMessage(&hcan, CAN_RX_FIFO0, &rxMessage, 100) == HAL_OK) {
      Serial.print("Received CAN message: ");
      Serial.print("ID: 0x");
      Serial.print(rxMessage.StdId, HEX);
      Serial.print(", DLC: ");
      Serial.print(rxMessage.DLC);
      Serial.print(", Data: ");
      for (uint8_t i = 0; i < rxMessage.DLC; i++) {
        Serial.print("0x");
        Serial.print(rxMessage.Data[i], HEX);
        Serial.print(" ");
      }
      Serial.println();
    }
  }
}