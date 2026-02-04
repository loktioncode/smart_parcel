#include <WiFi.h>
#include <esp_now.h>

// LED Pin
const int LED_PIN = 8;

// Structure to send data
// Must match the receiver structure
typedef struct struct_message {
  int id;
  char type[10]; // "CARD"
} struct_message;

struct_message myData;

// Unique ID for this card - CHANGE THIS for each card
const int CARD_ID = 101;

// Broadcast address to send to all peers (or specific Gateway MAC)
uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

esp_now_peer_info_t peerInfo;

// Callback when data is sent (ESP32 Arduino Core 3.x signature)
void OnDataSent(const esp_now_send_info_t *info, esp_now_send_status_t status) {
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Success"
                                                : "Delivery Fail");
}

void setup() {
  Serial.begin(9600);

  // Setup LED pin
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // LED on when card is powered

  // Set device as a Wi-Fi Station
  WiFi.mode(WIFI_STA);

  // Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register send callback
  esp_now_register_send_cb(OnDataSent);

  // Register peer
  memcpy(peerInfo.peer_addr, broadcastAddress, 6);
  peerInfo.channel = 0;
  peerInfo.encrypt = false;

  if (esp_now_add_peer(&peerInfo) != ESP_OK) {
    Serial.println("Failed to add peer");
    return;
  }
}

void loop() {
  // Set values to send
  myData.id = CARD_ID;
  strcpy(myData.type, "CARD");
  Serial.println("start");

  // Blink LED to indicate heartbeat transmission
  digitalWrite(LED_PIN, LOW); // LED off briefly
  delay(100);
  digitalWrite(LED_PIN, HIGH); // LED back on

  // Send message via ESP-NOW
  esp_err_t result =
      esp_now_send(broadcastAddress, (uint8_t *)&myData, sizeof(myData));

  if (result == ESP_OK) {
    Serial.println("Sent with success");
  } else {
    Serial.println("Error sending the data");
  }

  // Send every 2 seconds
  delay(1900); // 1900ms + 100ms blink = 2000ms total
}
