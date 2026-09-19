---
name: cloud
description: >-
  Cloud infrastructure and serverless architecture: AWS, GCP, Azure, S3, IAM policies, and cloud networking. Use when deploying cloud infrastructure, configuring S3 buckets, setting up IAM permissions, or managing cloud environments. Not for Dockerfile definitions or local git workflows (that is docker or git).
---

# Cloud Infrastructure: Object Storage, Serverless & IAM Hardening

## 1. Core Cloud Invariants

1. **Direct-to-Storage Presigned Uploads**: Application servers must never buffer large file uploads in memory. Generate short-lived presigned URLs (e.g. AWS S3, Google Cloud Storage) so clients upload directly to object storage.
2. **Strict IAM Least-Privilege**: Every service role or IAM policy must specify exact resource ARNs and minimal action permissions. Never use wildcard `Resource: "*"` or `Action: "*"`.
3. **Automated Cost Control & Budget Alerts**: Configure billing alerts with thresholds (50%, 80%, 100% of expected spend) to catch runaway lambdas, unattached EBS volumes, or unexpected data transfer.
4. **Cloud-Native Ephemerality**: Design instances and serverless functions to be stateless; persist all persistent state to managed databases or object storage.

---

## 2. Key Implementation Patterns

### A. S3 Presigned URL for Direct File Uploads
```typescript
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function createUploadPresignedUrl(
  userId: string,
  contentType: string,
  fileExtension: string
) {
  // Validate allowed content types
  const ALLOWED_MIME = ["image/jpeg", "image/png", "application/pdf"];
  if (!ALLOWED_MIME.includes(contentType)) {
    throw new Error("Unsupported upload mime type");
  }

  const key = `uploads/${userId}/${crypto.randomUUID()}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  // Short expiration window (5 minutes)
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { uploadUrl, key };
}
```

### B. Hardened IAM Policy Example
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowUserScopedS3Uploads",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::my-app-uploads/uploads/*"
    }
  ]
}
```

---

## 3. Anti-Patterns to Avoid

- **Streaming Big Files Through App Servers**: Receiving 50MB files on Node.js/Express, consuming server RAM and blocking event loops.
- **Root Cloud Credentials in Applications**: Embedding AWS root access keys or master GCP service accounts in code.
- **Publicly Readable S3 Buckets**: Disabling S3 "Block Public Access" settings, leading to unintentional data leaks.

---

## 4. Verification Checklist

- [ ] S3 buckets have "Block all public access" enabled.
- [ ] User uploads use short-lived presigned URLs.
- [ ] IAM roles grant only specific actions on designated resource ARNs.
- [ ] Budget notifications are active in cloud billing dashboard.
