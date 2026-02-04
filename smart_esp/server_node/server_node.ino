#include <ArduinoJson.h> // Make sure to install ArduinoJson via Library Manager
#include <WebServer.h>
#include <WiFi.h>
#include <esp_now.h>

// LED Pin
const int LED_PIN = 2;

// Wireless Credentials for the AP
const char *ssid = "SmartParcel_AP";
const char *password = "password123";

// Structure to receive data (Heartbeat)
// Must match the sender structure
typedef struct struct_message {
  int id;
  char type[10]; // "CARD"
} struct_message;

struct_message myData;

// Data structure to store active cards
struct CardInfo {
  int id;
  unsigned long lastSeen;
};

// Simple array to store active cards (can be optimized with std::vector or
// linked list)
#define MAX_CARDS 50
CardInfo activeCards[MAX_CARDS];
int activeCardCount = 0;

// Cleanup timeout - if a card isn't seen for 10 seconds, it's considered gone
const unsigned long TIMEOUT_MS = 10000;

WebServer server(80);

// Callback when data is received via ESP-NOW (ESP32 Arduino Core 3.x signature)
void OnDataRecv(const esp_now_recv_info_t *info, const uint8_t *incomingData,
                int len) {
  memcpy(&myData, incomingData, sizeof(myData));

  // Blink LED to indicate heartbeat received
  digitalWrite(LED_PIN, LOW); // LED off briefly
  delay(50);
  digitalWrite(LED_PIN, HIGH); // LED back on

  Serial.print("Heartbeat from Card ID: ");
  Serial.println(myData.id);

  // Update or Add Card
  bool found = false;
  for (int i = 0; i < activeCardCount; i++) {
    if (activeCards[i].id == myData.id) {
      activeCards[i].lastSeen = millis();
      found = true;
      break;
    }
  }

  if (!found && activeCardCount < MAX_CARDS) {
    activeCards[activeCardCount].id = myData.id;
    activeCards[activeCardCount].lastSeen = millis();
    activeCardCount++;
    Serial.print("New Card Detected: ");
    Serial.println(myData.id);
  }
}

void setup() {
  Serial.begin(115200);

  // Setup LED pin
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH); // LED on when server is running

  // 1. Init WiFi in AP Mode
  WiFi.mode(WIFI_AP_STA); // AP for App connection, STA for ESP-NOW (ESP-NOW
                          // needs separate channel or same as AP)
  // Note: For ESP-NOW and Wifi to work together, they must be on the same
  // channel. SoftAP default is usually channel 1.

  WiFi.softAP(ssid, password, 1, 0, 4); // SSID, Pass, Channel, Hidden, MaxConn
  Serial.println("AP Started");
  Serial.print("IP Address: ");
  Serial.println(WiFi.softAPIP());

  // 2. Init ESP-NOW
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }

  // Register callback
  esp_now_register_recv_cb(OnDataRecv); // Use esp_now_register_recv_cb instead
                                        // of esp_now_register_recv_cb_t cast

  // 3. Init Web Server
  server.on("/api/cards", HTTP_GET, []() {
    // Create JSON response
    // Using ArduinoJson 6 or 7
    // DynamicJsonDocument doc(1024); // Old version
    JsonDocument doc; // ArduinoJson 7

    JsonArray cards = doc["cards"].to<JsonArray>();

    unsigned long currentMillis = millis();

    // Iterate and prune simultaneously (or just filter for response)
    // We will clean up in loop(), here we just report active ones
    for (int i = 0; i < activeCardCount; i++) {
      JsonObject card = cards.add<JsonObject>();
      card["id"] = activeCards[i].id;
      card["last_seen_ms_ago"] = currentMillis - activeCards[i].lastSeen;
    }

    String jsonString;
    serializeJson(doc, jsonString);
    server.send(200, "application/json", jsonString);
  });

  server.begin();
  Serial.println("HTTP Server started");
}

void loop() {
  server.handleClient();

  // Prune inactive cards
  unsigned long currentMillis = millis();
  for (int i = 0; i < activeCardCount; i++) {
    if (currentMillis - activeCards[i].lastSeen > TIMEOUT_MS) {
      Serial.print("Card Lost: ");
      Serial.println(activeCards[i].id);

      // Remove by shifting
      for (int j = i; j < activeCardCount - 1; j++) {
        activeCards[j] = activeCards[j + 1];
      }
      activeCardCount--;
      i--; // Recheck this index as it's now occupied by the next element
    }
  }

  delay(10); // Small yield
}
