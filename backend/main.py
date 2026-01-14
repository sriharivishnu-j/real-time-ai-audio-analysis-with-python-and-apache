from fastapi import FastAPI, HTTPException
from kafka import KafkaConsumer, KafkaProducer
import threading
import os

app = FastAPI()

KAFKA_BROKER_URL = os.getenv('KAFKA_BROKER_URL', 'localhost:9092')
KAFKA_TOPIC = os.getenv('KAFKA_TOPIC', 'audio-analysis')

# Kafka Producer
producer = KafkaProducer(bootstrap_servers=KAFKA_BROKER_URL)

# Kafka Consumer
consumer = KafkaConsumer(
    KAFKA_TOPIC,
    bootstrap_servers=KAFKA_BROKER_URL,
    auto_offset_reset='earliest',
    group_id='audio-analysis-group',
    enable_auto_commit=True
)

def consume_messages():
    for message in consumer:
        process_message(message.value)

threading.Thread(target=consume_messages, daemon=True).start()

@app.post("/analyse-audio/")
async def analyse_audio(audio_data: bytes):
    try:
        # Here you would integrate with an AI model for analysis
        # For demonstration, we just send to Kafka
        producer.send(KAFKA_TOPIC, audio_data)
        return {"message": "Audio data is being processed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def process_message(message):
    # Placeholder for message processing logic
    # Replace with actual AI analysis logic
    print("Processing message:", message)
