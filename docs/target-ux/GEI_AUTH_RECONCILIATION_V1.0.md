# GEI Auth Reconciliation V1.0

**Authority:** FROZEN — Resolution of TARGET-CONFLICT-001 and TARGET-CONFLICT-002  
**Date:** 2026-10-22  
**Status:** RESOLVED — Supersedes contradictory statements in prior documentation  
**Related:** `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md`, `GEI_TARGET_UX_FREEZE_V1.0.md`, `GEI_SCOPE_RECONCILIATION_V1_1.md`

---

## CONFLICT SUMMARY

### TARGET-CONFLICT-001
**Prior statement (contradictory):**
> "email verification activates an account"

**Frozen Target UX / Product Truth V1.1:**
> "activation via administrative/setup code"
> "ACTIVATION SUCCESS does NOT auto-login"

### TARGET-CONFLICT-002
**Prior statement (contradictory):**
> "email password recovery is self-service"

**Frozen Target UX / Product Truth V1.1:**
> "RECOVERY: administrative"
> "SELF-SERVICE FORGOT PASSWORD: OUT OF V1"

---

## AUTH RECONCILIATION

### Old Statement (Superseded)
```
Email verification activates an account; email password recovery is self-service.
Logout manages the current session.
```
**Source:** `GEI_SCOPE_RECONCILIATION_V1_1.md` line 19 (V1.1) — **this line contradicts the auth model declared in the same document lines 16-17 and Product Truth V1.1**

### Superseded By (Final GEI V1 Auth Model)
```
LOGIN
email + password

USERNAME
profile identity only

ACTIVATION
administrative/setup code (delivered by admin to person)

ACTIVATION SUCCESS
does NOT auto-login → returns to /login

RECOVERY
administrative (re-issue setup code by admin)

SELF-SERVICE FORGOT PASSWORD
OUT OF V1

OAUTH
OUT

MFA
OUT

PASSKEYS
OUT

CHANGE PASSWORD
authenticated (current + new), credentialVersion++, optional session invalidation
```
**Source:** `GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md` §16-17, `GEI_TARGET_UX_FREEZE_V1.0.md` Global/Auth section

### Reason
**Alignment with frozen GEI V1 auth model as declared in Product Truth V1.1.**

The Product Truth V1.1 explicitly states:
- Line 16: "Login uses Person.email plus password. Person.email is the only canonical email..."
- Line 17: "username remains unique... it is not a credential, login key or recovery identifier."
- Line 19: "Email verification activates an account; email password recovery is self-service." **← THIS LINE CONTRADICTS LINES 16-17 AND THE EXPLICIT AUTH MODEL**

The explicit auth model (lines 16-17 + Target UX freeze) takes precedence. Line 19 of Scope Reconciliation V1.1 is a **documentation error** carried from V1.0.1.

---

## IMPACTED DOCUMENTS (Corrected)

| Document | Section | Correction |
|----------|---------|------------|
| `GEI_SCOPE_RECONCILIATION_V1_1.md` | Line 19 | **Superseded** — see Auth Model above. This line is erroneous and contradicts the binding target. |
| `GEI_TARGET_UX_FREEZE_V1.0.md` | Global/Auth/Cross-Domain Freeze | **Already correct** — declares admin activation, no self-service recovery |
| `DOMAIN_01_HOME_FREEZE_V1.0.md` | Actor variants / Profile | **Already correct** — Profile section 7 (Seguridad) specifies admin recovery |
| `DOMAIN_05_MORE_MANAGEMENT_FREEZE_V1.0.md` | Profile / Account Activation | **Already correct** — specifies admin activation code, no auto-login, admin recovery |

---

## VERIFICATION

**TARGET-CONFLICT-001 = RESOLVED** ✓  
**TARGET-CONFLICT-002 = RESOLVED** ✓

No other contradictions found between Product Truth V1.1 and Target UX Freeze V1.0.

---

## CHANGE CONTROL RECORD

**CR-ID:** `GEI-UX-CR-20261022-001`  
**Date:** 2026-10-22  
**Scope:** Auth model documentation reconciliation  
**Approved By:** Product Owner, UX Lead, Tech Lead (per `GEI_TARGET_UX_CHANGE_CONTROL_V1.0.md`)  
**Version Bump:** Target UX Freeze V1.0 → V1.1 (pending next release)  
**Git Tag:** `gei/target-ux-v1.1` (to be created on next release)

---

## NOTE FOR IMPLEMENTATION

This reconciliation **does not change implementation requirements** — it only corrects documentation to match the already-frozen auth model. The implementation gaps for auth (login, activate, no-access, profile security section) remain as documented in the implementation gap audit.

**Key implementation reminders (already frozen):**
- `/activate` accepts admin-delivered setup code only
- Activation success → redirect to `/login` (not auto-login)
- Profile "Seguridad" section: "Generar código de activación" (admin only), "Cambiar contraseña" (authenticated)
- No "Olvidé mi contraseña" link anywhere
- No OAuth/MFA/Passkeys UI

---

## VERSION
`GEI_AUTH_RECONCILIATION_V1.0` — 2026-10-22