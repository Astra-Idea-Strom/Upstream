---
name: analytics
description: >-
  Data analytics: SQL aggregations, event tracking schema, cohort analysis, funnel reporting, and OLAP query optimization. Use when building analytics dashboards, calculating retention metrics, designing telemetry events, or writing aggregation queries. Not for transactional relational operations (that is sql or postgresql).
---

# Analytics: Event Taxonomies, Metric Aggregation & Funnel Analytics

## 1. Event Tracking Taxonomy

Design event tracking using the standardized **Object + Verb** naming convention:

| Standard Event Name | Trigger Context | Standard Properties Payload |
| :--- | :--- | :--- |
| `user_signed_up` | Account creation confirmed | `{ method: "oauth_google", plan: "free" }` |
| `order_completed` | Payment gateway confirmation | `{ order_id: "ord_123", amount_cents: 4900, currency: "USD", items_count: 2 }` |
| `document_uploaded`| File successfully parsed | `{ file_type: "pdf", byte_size: 204850, processing_ms: 320 }` |

---

## 2. Funnel & Retention Analysis Queries

Compute user drop-off across a sequential multi-step funnel in SQL:

```sql
-- 3-Step Onboarding Funnel Conversion Rate
WITH funnel_steps AS (
  SELECT
    user_id,
    COUNT(CASE WHEN event = 'viewed_signup' THEN 1 END) > 0 AS step_1_viewed,
    COUNT(CASE WHEN event = 'submitted_signup' THEN 1 END) > 0 AS step_2_submitted,
    COUNT(CASE WHEN event = 'completed_profile' THEN 1 END) > 0 AS step_3_profile
  FROM analytics_events
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
)
SELECT
  COUNT(*) AS total_visitors,
  COUNT(CASE WHEN step_1_viewed THEN 1 END) AS step_1_count,
  COUNT(CASE WHEN step_2_submitted THEN 1 END) AS step_2_count,
  COUNT(CASE WHEN step_3_profile THEN 1 END) AS step_3_count,
  ROUND(COUNT(CASE WHEN step_3_profile THEN 1 END)::numeric / NULLIF(COUNT(CASE WHEN step_1_viewed THEN 1 END), 0) * 100, 2) AS overall_conversion_pct
FROM funnel_steps;
```

---

## 3. Privacy-First Analytics Integration
- Strip personal identifiable information (PII) before sending events to third-party tools (PostHog, Plausible).
- Hash or truncate IP addresses and mask query parameters containing emails or tokens.
- Comply with "Do Not Track" (`navigator.doNotTrack`) and cookie consent selections.

---

## 4. Anti-Patterns
- **The Telemetry Firehose**: Emitting 100 events per second for every mouse move or scroll tick, overwhelming analytics budgets.
- **Inconsistent Event Names**: Mixing `UserRegistered`, `user_signup`, and `created-account` across different codebases.
- **Tracking Unsanitized URLs**: Capturing raw URLs like `/reset-password?token=secret123` into analytics logs.

---

## 5. Verification Check
- Are event names consistent using the `object_action` format?
- Are analytics payloads free of PII and sensitive tokens?
- Are analytical aggregation queries indexed properly by event name and timestamp?
