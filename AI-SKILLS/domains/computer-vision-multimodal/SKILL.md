---
name: computer-vision-multimodal
description: >-
  Computer vision and multimodal AI: image classification, object detection, OCR extraction, and visual inspection. Use when analyzing images with multimodal LLMs, running client-side vision inference, or extracting text from visual layouts. Not for PDF or text document parsing (that is document-processing).
---

# Computer Vision & Multimodal AI: Image Ingestion, Vision LLMs & Object Analysis

## 1. Core Vision Invariants

1. **Client-Side Image Downscaling**: High-resolution smartphone photos (12–48MP, 5–15MB) must be downscaled on the client before upload (max 1920x1080 or 2048x2048, JPEG quality 85%). Sending raw 15MB files exhausts network bandwidth and exceeds model token limits without increasing recognition accuracy.
2. **Structured Vision Prompting**: When querying vision models (e.g. GPT-4o, Gemini 1.5 Flash), enforce structured JSON output schemas to return bounding boxes, labels, quantities, and confidence scores.
3. **Graceful Degradation on Low-Quality Images**: If an image is blurry, underexposed, or truncated, the model must explicitly return `"clarity_warning": true` with actionable suggestions for the user to retake the photo.
4. **Metadata & Exif Stripping**: Strip sensitive GPS location tags and camera serial numbers from user-uploaded images prior to cloud storage or AI inference.

---

## 2. Key Implementation Patterns

### A. Client-Side Image Preprocessing & Downscaling (Canvas)
```typescript
export async function resizeImageForInference(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.round((height * maxDimension) / width);
      width = maxDimension;
    } else {
      width = Math.round((width * maxDimension) / height);
      height = maxDimension;
    }
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas 2d context");

  ctx.drawImage(bitmap, 0, 0, width, height);
  return await canvas.convertToBlob({ type: "image/jpeg", quality });
}
```

### B. Vision LLM Object Classification & Inventory Extraction (OpenAI / Gemini)
```typescript
import OpenAI from "openai";

const openai = new OpenAI();

export async function identifyPantryIngredients(imageBase64: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a culinary vision AI. Analyze the image of the refrigerator or pantry.
Identify all visible food ingredients, estimated quantities, and freshness status.
Output JSON schema:
{
  "ingredients": [
    { "name": string, "quantity": string, "category": "produce" | "dairy" | "meat" | "pantry" }
  ],
  "image_quality": "clear" | "blurry" | "obscured"
}`
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Identify all ingredients visible in this pantry shelf." },
          {
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
          }
        ]
      }
    ]
  });

  return JSON.parse(response.choices[0].message.content || "{}");
}
```

---

## 3. Anti-Patterns to Avoid

- **Uploading Multi-Megabyte Raw Camera Files**: Uploading 10MB uncompressed TIFFs or RAW files directly to LLM APIs, incurring massive latency and token costs.
- **Unvalidated Vision Hallucinations**: Trusting vision model classifications blindly without confidence metrics or user confirmation in safety-critical domains (e.g. allergen detection).
- **Ignoring EXIF Geolocation Data**: Storing photos with embedded longitude/latitude coordinates, causing major privacy violations.

---

## 4. Verification Checklist

- [ ] Images are downscaled to <= 1920px on the client before network transmission.
- [ ] EXIF metadata (especially GPS coordinates) is stripped prior to storage.
- [ ] Vision API returns structured, schema-validated JSON outputs.
- [ ] Low-quality or ambiguous images trigger a polite user prompt to retake.
