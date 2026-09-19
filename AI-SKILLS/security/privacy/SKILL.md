---
name: privacy
description: >-
  Data privacy engineering: GDPR, CCPA, PII anonymization, data retention policies, consent management, and encryption at rest. Use when handling personally identifiable information (PII), implementing user deletion requests, or configuring privacy controls. Not for cloud secrets management or password hashing (that is secrets-management or authentication).
---

# Privacy Engineering: PII Protection, Compliance & Data Minimization

## 1. Core Privacy Invariants

1. **Principle of Data Minimization**: Only collect, process, and retain the absolute minimum Personally Identifiable Information (PII) necessary for the declared feature.
2. **Right to Erasure (GDPR Art. 17)**: Every system storing user data must implement an automated, verifiable purge workflow that cascades across databases, search indexes, caches, and backups.
3. **Zero Plaintext Sensitive PII**: Passwords, government IDs, credit card numbers, and health records must be cryptographically hashed or encrypted at rest using AES-256-GCM.
4. **Explicit Consent & Purpose Binding**: User consent must be opt-in, versioned, timestamped, and tied to specific processing purposes.

---

## 2. Key Implementation Patterns

### A. Automated PII Redaction Regex Engine
```typescript
export function redactPII(text: string): string {
  if (!text) return text;

  return text
    // Email addresses
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi, "[REDACTED_EMAIL]")
    // US Social Security Numbers
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[REDACTED_SSN]")
    // Credit card numbers (standard 13-19 digits with separators)
    .replace(/\b(?:\d{4}[ -]?){3}(?:\d{1,4})\b/g, "[REDACTED_CARD]")
    // Phone numbers (E.164 and local formats)
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[REDACTED_PHONE]")
    // IPv4 addresses
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[REDACTED_IP]");
}
```

### B. Field-Level Encryption at Rest
```typescript
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const KEY = Buffer.from(process.env.ENCRYPTION_KEY_HEX || "", "hex"); // 32 bytes

export function encryptField(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(plaintext, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  // Format: iv:authTag:ciphertext
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptField(ciphertextBundle: string): string {
  const [ivHex, authTagHex, encryptedText] = ciphertextBundle.split(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
```

### C. Right-to-be-Forgotten Cascading Deletion
```typescript
export async function deleteUserData(userId: string): Promise<void> {
  await db.$transaction(async (tx) => {
    // 1. Delete transactional records or anonymize foreign keys
    await tx.orders.updateMany({
      where: { userId },
      data: { shippingAddress: "[ANONYMIZED]", customerName: "[DELETED]" }
    });
    
    // 2. Delete sensitive personal entities
    await tx.userProfiles.deleteMany({ where: { userId } });
    await tx.sessions.deleteMany({ where: { userId } });
    await tx.users.delete({ where: { id: userId } });
  });

  // 3. Invalidate search indexes and cache
  await redis.del(`user:cache:${userId}`);
}
```

---

## 3. Anti-Patterns to Avoid

- **Logging Full Request Payloads in Production**: Dumping raw JSON bodies containing billing information or passwords into CloudWatch or Datadog.
- **Storing PII in Analytics Tools**: Passing user emails, names, or unmasked IPs as properties in Google Analytics or PostHog events.
- **Soft Deleting Without Purge SLA**: Marking records as `is_deleted = true` indefinitely without an automated process to permanently destroy PII after statutory retention expires.
- **Using Reversible Obfuscation as Encryption**: Base64 encoding or ROT13 is encoding, not encryption. Always use authenticated symmetric ciphers (AES-GCM).

---

## 4. Verification Checklist

- [ ] Log sanitizers redact emails, cards, and phone numbers.
- [ ] Database columns holding sensitive credentials use field-level encryption.
- [ ] Account deletion endpoint purges or anonymizes all associated data across schemas.
- [ ] Cookie consent banners track explicit user opt-in before third-party tracking scripts load.
