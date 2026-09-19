---
name: audio-speech-processing
description: >-
  Audio and speech processing: Whisper transcription, text-to-speech (TTS), Web Audio API, and audio normalization. Use when transcribing audio, generating synthetic speech, processing audio streams in the browser, or converting audio formats. Not for computer vision or text document extraction (that is computer-vision-multimodal or document-processing).
---

# Audio & Speech Processing: Recording, Whisper Transcription & Diarization

## 1. Core Audio Invariants

1. **Client-Side Compression**: Audio recorded in the browser must be compressed before upload (e.g. `audio/webm;codecs=opus`) rather than uploading uncompressed raw PCM WAV files, reducing bandwidth by 80–90%.
2. **Asynchronous Processing Pipeline**: Audio transcription, diarization, and TTS synthesis are CPU/GPU-intensive tasks. Never run them synchronously in HTTP request cycles; offload to a background task queue (BullMQ / Celery).
3. **Chunking for Large Files**: Files larger than 25MB (Whisper API limit) must be split on silence boundaries (`pydub` silence detection) before sending to transcription endpoints.
4. **Resilient Audio Context Lifecycle**: Cleanly release browser `MediaStream` tracks and close `AudioContext` instances on component unmount to prevent microphone indicator lock and memory leaks.

---

## 2. Key Implementation Patterns

### A. Browser MediaRecorder Audio Capture (Web Audio API)
```typescript
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async start(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];

    // Prioritize high-efficiency opus encoding
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/mp4";

    this.mediaRecorder = new MediaRecorder(stream, { mimeType });
    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.audioChunks.push(event.data);
    };

    this.mediaRecorder.start(250); // Emit chunks every 250ms
  }

  async stop(): Promise<Blob> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) throw new Error("Recorder not initialized");

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.mediaRecorder?.mimeType });
        // Stop all tracks to turn off microphone LED
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }
}
```

### B. Node.js / Python Whisper Speech-to-Text Pipeline
```python
from openai import OpenAI
import os

client = OpenAI()

def transcribe_audio_file(file_path: str, language: str = "en") -> dict:
    with open(file_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language=language,
            response_format="verbose_json",
            timestamp_granularities=["segment", "word"]
        )
    
    return {
        "text": transcript.text,
        "segments": [
            {
                "start": seg.start,
                "end": seg.end,
                "text": seg.text
            }
            for seg in transcript.segments
        ]
    }
```

---

## 3. Anti-Patterns to Avoid

- **Synchronous Upload & Wait**: Blocking an HTTP connection for 45 seconds while Whisper transcribes a 10-minute podcast, causing browser timeouts.
- **Unreleased Microphone Streams**: Forgetting to call `track.stop()`, causing the user's browser tab to show an active recording indicator indefinitely.
- **Transcribing Without Language Priming**: Leaving `language` unspecified when the application domain is strictly English, Spanish, or Hindi, increasing transcription latency and hallucinated scripts.

---

## 4. Verification Checklist

- [ ] Browser recording properly releases microphone tracks upon stop.
- [ ] Large audio files (> 25MB) are chunked or processed asynchronously.
- [ ] Whisper responses parse word/segment timestamps for synchronized UI playback.
- [ ] Waveform visualizer renders smoothly without blocking UI thread.
