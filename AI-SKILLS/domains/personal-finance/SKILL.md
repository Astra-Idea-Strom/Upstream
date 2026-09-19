---
name: personal-finance
description: >-
  Personal finance applications: ledger double-entry bookkeeping, currency precision, interest calculations, and transaction categorization. Use when building expense trackers, calculating financial balances, handling multi-currency transactions, or preventing float rounding. Not for relational database design or general analytics (that is data-modeling or analytics).
---

# Personal Finance: Precise Currency Math, Double-Entry & Transaction Parsing

## 1. Core Financial Invariants

1. **Zero Floating-Point Currency Math**: Never store or calculate money using IEEE 754 floating-point numbers (`0.1 + 0.2 === 0.30000000000000004`). Store currency as signed integers in the smallest currency unit (e.g. cents: `$10.50` -> `1050`), or use arbitrary-precision decimal libraries (`Decimal.js`, `BigNumber`).
2. **Double-Entry Bookkeeping Equilibrium**: Every recorded financial movement must have balanced debit and credit legs where Sum(Debits) = Sum(Credits). Money cannot be created or destroyed within the ledger.
3. **Immutable Transaction History**: Once a ledger entry is committed, it must never be modified or deleted. Corrections must be executed as explicit offsetting reversal entries.
4. **Data Sanitization on Ingestion**: Bank transaction descriptions frequently contain sensitive account numbers or personal names. Sanitize strings before storing or sending to categorization models.

---

## 2. Key Implementation Patterns

### A. Safe Integer Currency Arithmetic
```typescript
export class Money {
  // Amount in minor currency units (e.g. cents)
  readonly amountCents: number;
  readonly currency: string;

  constructor(amountCents: number, currency = "USD") {
    if (!Number.isInteger(amountCents)) {
      throw new Error("Money amount must be an integer (minor unit / cents)");
    }
    this.amountCents = amountCents;
    this.currency = currency;
  }

  static fromDecimal(amount: number, currency = "USD"): Money {
    // Round safely to eliminate floating point artifacts
    return new Money(Math.round(amount * 100), currency);
  }

  add(other: Money): Money {
    this.assertMatchingCurrency(other);
    return new Money(this.amountCents + other.amountCents, this.currency);
  }

  subtract(other: Money): Money {
    this.assertMatchingCurrency(other);
    return new Money(this.amountCents - other.amountCents, this.currency);
  }

  format(): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: this.currency,
    }).format(this.amountCents / 100);
  }

  private assertMatchingCurrency(other: Money) {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }
}
```

### B. Double-Entry Ledger Schema (PostgreSQL)
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
    currency CHAR(3) NOT NULL DEFAULT 'USD'
);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id),
    amount_cents BIGINT NOT NULL, -- positive for debit, negative for credit
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invariant Trigger: Sum of amount_cents across a journal_entry must equal 0
```

---

## 3. Anti-Patterns to Avoid

- **Using `FLOAT` or `REAL` in Databases**: Defining `amount FLOAT` in SQL schemas, introducing compounding rounding errors across account balances.
- **Modifying Historical Transactions**: Overwriting transaction records to balance accounts rather than posting reversing adjustment entries.
- **Ignoring Timezone Differences in Bank Feeds**: Recording UTC transactions on the wrong local accounting date without storing original local timestamps.

---

## 4. Verification Checklist

- [ ] All financial amounts are stored as integer minor units (cents) or `NUMERIC(12, 2)`.
- [ ] Ledger entries maintain zero-sum equilibrium (Sum(debits) - Sum(credits) = 0).
- [ ] Bank CSV parsers sanitize account numbers and handle inconsistent date formats (`MM/DD/YYYY` vs `DD/MM/YYYY`).
- [ ] Formatting uses standard `Intl.NumberFormat` for multi-currency display.
