# DarkVault System Architecture

```
                  +-------------------------------------------------------+
                  |                 DARKVAULT CLIENT (Browser)            |
                  |                                                       |
                  |  [React 19 + TypeScript + Vite + Tailwind CSS v4]      |
                  |                                                       |
                  |  +--------------------+    +-----------------------+  |
                  |  |  Analyzer Engine   |    |  Web Crypto CSPRNG    |  |
                  |  |  - Shannon Entropy |    |  - Rejection Sampling |  |
                  |  |  - Leetspeak Norm  |    |  - Passphrase Diceware|  |
                  |  |  - Keyboard Walks  |    |  - Hardware Clocks    |  |
                  |  +--------------------+    +-----------------------+  |
                  |             |                          |              |
                  |             v                          v              |
                  |  +--------------------+    +-----------------------+  |
                  |  | Local SHA-1 Hash   |    | Client-Side PDF Engine|  |
                  |  | Prefix (5 hex)     |    | - jsPDF & AutoTable   |  |
                  |  | Suffix (35 hex)    |    | - Offline Fallback    |  |
                  |  +--------------------+    +-----------------------+  |
                  +--------------|----------------------------------------+
                                 |
                                 | HTTPS GET /api/breach/range/{prefix}
                                 | (ONLY 5-char prefix transmitted)
                                 v
                  +-------------------------------------------------------+
                  |               DARKVAULT BACKEND (FastAPI)             |
                  |                                                       |
                  |  +-------------------------------------------------+  |
                  |  | Security Middleware                             |  |
                  |  | - Rejects plaintext password query parameters   |  |
                  |  | - Strict HSTS, CSP, X-Frame-Options             |  |
                  |  +-------------------------------------------------+  |
                  |  | K-Anonymity Service                             |  |
                  |  | - TTL in-memory LRU Cache                       |  |
                  |  | - Adds padding to prevent side-channel leaks    |  |
                  |  +-------------------------------------------------+  |
                  |  | PDF Reporting Service                           |  |
                  |  | - ReportLab Executive Document Compiler         |  |
                  |  +-------------------------------------------------+  |
                  |  | SQLite / PostgreSQL Telemetry Store             |  |
                  |  | - Anonymous metrics only (score, bits, length)  |  |
                  |  +-------------------------------------------------+  |
                  +-------------------------------------------------------+
                                 |
                                 | HTTPS GET https://api.pwnedpasswords.com/range/{prefix}
                                 v
                  +-------------------------------------------------------+
                  |      Have I Been Pwned Global Breach Database         |
                  |      (1,000,000,000+ Compromised Passwords)           |
                  +-------------------------------------------------------+
```

## Key Architectural Principles

### 1. Zero-Knowledge Boundary
Under no circumstance does a plaintext password cross the network boundary to the backend server.
All password strength scoring, Shannon entropy calculations, character diversity checks, sequence matching, and leetspeak deciphering are performed inside browser volatile memory.

### 2. K-Anonymity Model
Breach lookups conform strictly to the Have I Been Pwned mathematical range protocol:
1. Client calculates `SHA-1(password)` using the Web Crypto API.
2. The 40-character hexadecimal output is partitioned into a 5-character prefix and a 35-character suffix.
3. The client queries `GET /api/breach/range/{prefix}`.
4. The server/upstream responds with all hash suffixes sharing the identical 5-character prefix (typically 500-1,000 hashes).
5. The client performs constant-time suffix comparison locally in browser memory.
6. Neither DarkVault backend nor HIBP ever discovers which specific hash belonged to the user.

### 3. Dual-Engine PDF Generation
DarkVault provides dual PDF generation paths:
- **Backend Executive PDF (ReportLab)**: High-resolution PDF document generated server-side from anonymized telemetry metrics.
- **Client-Side Air-Gapped PDF (jsPDF)**: Direct in-browser generation for fully disconnected or air-gapped environments.

### 4. Modular Separation of Concerns
- **UI Components**: Atomic, styled with Tailwind CSS and Framer Motion.
- **Crypto Services**: Standalone, pure functional engines using Web Crypto API.
- **Dictionary Engines**: Local Sets and normalized lookups for zero latency.
- **Backend API**: Clean REST architecture with Pydantic schema validation.

