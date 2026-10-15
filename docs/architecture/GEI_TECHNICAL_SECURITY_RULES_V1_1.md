# GEI Technical Security Rules V1.1

These engineering rules preserve security and integrity intent without presenting implementation choices as Victoria's product features.

- Secure password hashing with versioned parameters and safe password policy.
- Secure server-side sessions and secure cookie attributes.
- CSRF protection when the interaction model requires it.
- Session expiry, inactivity and revocation policy.
- Rate limiting for authentication and abuse-sensitive operations.
- Cryptographic token generation, storage and verification.
- Multi-tab session coordination when implemented.
- Idempotency implementation for commands and asynchronous effects; this is REQ-SYS-016, not REQ-IAM-016.
- Optimistic concurrency and atomic transaction implementation.
- Operational bulk limits for Jornada and recurrence limits for EventSeries.
- Autosave debounce for Selection drafts.

Exact algorithms, durations, attempt counts, cookie names, HMAC details, 600 ms, 100 and 366 are technical parameters and may change without changing Product Truth.
