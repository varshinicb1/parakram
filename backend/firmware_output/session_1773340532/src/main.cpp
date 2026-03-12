#include <Arduino.h>
#include "config.h"
#include "stm32f4xx_hal.h"

// Define the CAN handle
CAN_HandleTypeDef hcan;

// Define a buffer for receiving CAN messages
uint8_t canRxBuffer[8];

// Define a flag to indicate if a message has been received
volatile bool messageReceived = false;

void setup() {
  // Initialize the serial port for debugging
  Serial.begin(SERIAL_BAUD_RATE);

  // Initialize the GPIO pins for CAN
  GPIO_InitTypeDef gpioInit;
  gpioInit.Pin = CAN_TX_PIN | CAN_RX_PIN;
  gpioInit.Mode = GPIO_MODE_ALTERNATE;
  gpioInit.Pull = GPIO_NOPULL;
  gpioInit.Speed = GPIO_SPEED_FREQ_HIGH;
  gpioInit.Alternate = CAN_AF;
  HAL_GPIO_Init(CAN_PORT, &gpioInit);

  // Initialize the CAN peripheral
  hcan.Instance = CAN1;
  hcan.Init.Prescaler = 2;  // Prescaler for CAN clock
  hcan.Init.Mode = CAN_MODE_NORMAL;
  hcan.Init.SyncJumpWidth = CAN_SYNC_JUMP_WIDTH_1;
  hcan.Init.TimeSeg1 = CAN_TIMESEG1_13TQ;
  hcan.Init.TimeSeg2 = CAN_TIMESEG2_2TQ;
  hcan.Init.TimeTriggeredMode = DISABLE;
  hcan.Init.AutoBusOff = DISABLE;
  hcan.Init.AutoWakeUp = DISABLE;
  hcan.Init.AutoRetransmission = DISABLE;
  hcan.Init.ReceiveFifoLocked = DISABLE;
  hcan.Init.TransmitFifoPriority = DISABLE;

  // Calculate the baud rate prescaler
  uint32_t canClock = SystemCoreClock / 2;  // CAN clock is half of the system clock
  uint32_t prescaler = canClock / CAN_BAUD_RATE;

  // Set the baud rate prescaler
  hcan.Init.Prescaler = prescaler;

  // Initialize the CAN handle
  if (HAL_CAN_Init(&hcan) != HAL_OK) {
    Serial.println("CAN initialization failed");
    while (1);
  }

  // Start the CAN reception
  if (HAL_CAN_Start(&hcan) != HAL_OK) {
    Serial.println("CAN start failed");
    while (1);
  }

  // Enable the CAN interrupt
  HAL_NVIC_SetPriority(CAN1_RX0_IRQn, 0, 0);
  HAL_NVIC_EnableIRQ(CAN1_RX0_IRQn);
}

void loop() {
  // Check if a message has been received
  if (messageReceived) {
    // Read the received message
    CAN_RxHeaderTypeDef rxHeader;
    uint32_t fifo = 0;
    if (HAL_CAN_GetRxMessage(&hcan, CAN_RX_FIFO0, &rxHeader, canRxBuffer, &fifo) == HAL_OK) {
      // Print the received message
      Serial.print("Received message: ID = ");
      Serial.print(rxHeader.StdId);
      Serial.print(", DLC = ");
      Serial.print(rxHeader.DLC);
      Serial.print(", Data = ");
      for (uint8_t i = 0; i < rxHeader.DLC; i++) {
        Serial.print(canRxBuffer[i], HEX);
        Serial.print(" ");
      }
      Serial.println();
    }

    // Reset the message received flag
    messageReceived = false;
  }

  // Delay for 100 ms
  delay(100);
}

// CAN RX0 interrupt handler
void CAN1_RX0_IRQHandler(void) {
  // Set the message received flag
  messageReceived = true;

  // Clear the interrupt flag
  HAL_CAN_IRQHandler(&hcan);
}