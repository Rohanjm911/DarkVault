# DarkVault Security & Zero-Knowledge Architecture

## 1. Zero-Knowledge Guarantees

Security and privacy are the non-negotiable core of DarkVault.

### Core Policies
- **Never store plaintext passwords:** Neither the client storage nor the backend database ever stores plaintext passwords.
- **Never log passwords:** The logging system prohibits credential inspection.
- **Never transmit passwords over the network:** Evaluation occurs strictly in volatile client memory.
- **Air-Gapped Analysis:** Calculations for entropy, character composition, sequential patterns, keyboard walking, and dictionary matches are executed on the user's CPU via Web Crypto API.

---

## 2. Threat Modeling & Countermeasures

| Threat Vector | Severity | DarkVault Mitigation |
| :--- | :---: | :--- |
| **Network Eavesdropping / Man-in-the-Middle** | High | Plaintext credentials never cross the wire. Breach queries send only 5-character SHA-1 prefixes over TLS. |
| **Server Database Compromise** | Critical | The database stores zero passwords and zero full hashes. Only aggregated anonymous metrics (e.g. score=85, length=18) are stored. |
| **API Parameter Leaks** | Medium | Custom FastAPI middleware intercepts and terminates any request containing `password` or `pwd` query parameters with `400 Bad Request`. |
| **Statistical Modulo Bias in Generation** | Medium | The random generator uses Web Crypto API `crypto.getRandomValues()` with rejection sampling rather than simple `%` operations. |
| **Side-Channel Timing Attacks** | Low | SHA-1 suffix comparison uses constant-time byte comparisons (`timingSafeEqual`) to prevent execution time profiling. |
| **Traffic Analysis on HIBP Range API** | Low | Downstream proxy adds `Add-Padding: true` headers to randomize response sizes and prevent fingerprinting based on packet length. |

---

## 3. Cryptographic Formulas & Standards

### Shannon Information Entropy
The theoretical entropy $H$ is computed as:

$$H = L \cdot \log_2(R)$$

Where:
- $L$ is the credential character length.
- $R$ is the size of the active character pool ($26 \text{ lower} + 26 \text{ upper} + 10 \text{ digits} + 33 \text{ symbols} + 1 \text{ space} \le 96$).

### Effective Entropy Deduction Heuristic
Real-world attackers do not conduct pure brute-force guesses across flat distributions; they leverage dictionaries, leetspeak mutation rules, and keyboard walking patterns. DarkVault penalizes raw entropy for:
- Exact common password hits (RockYou / SecLists): $-35\text{ bits}$
- Leetspeak substitutions of dictionary words: $-12 \text{ to } -28\text{ bits}$
- Consecutive repeated characters: $-\text{run} \times 3\text{ bits}$
- Predictable numerical/alphabetical sequences: $-\text{length} \times 3.5\text{ bits}$
- Spatial keyboard walks (QWERTY/numpad): $-16\text{ bits}$
- Calendar years (1950–2035) / birthdates: $-10\text{ bits}$

### NIST SP 800-63B Guidelines Implemented
1. Minimum length $\ge 8$ characters (recommends $\ge 16$ characters).
2. Maximum length supported up to 64+ characters (allows long passphrases).
3. Automated screening against known compromised credentials via k-anonymity.
4. Elimination of composition rules that encourage predictable patterns (e.g., "Password1!").
5. Discouragement of forced arbitrary expiration intervals.

