import { describe, expect, it } from "vitest"
import { T04ReadService } from "./read/t04-read.js"
import { notificationDedupeKey } from "./notification/notification.js"
import { AppError, httpStatusFor } from "./shared/errors.js"

/**
 * T04 R3 — lógica pura de participación (modalidad UNIT).
 * No toca base de datos: cubre las derivaciones canónicas y el contrato de errores.
 */

describe("T04 — derivación del estado de disponibilidad (A-D04-01)", () => {
  it("sin fila persistida el estado es NO_RESPONSE (nunca persistido)", () => {
    expect(T04ReadService.availabilityState(null, 0, 3)).toBe("NO_RESPONSE")
  })

  it("con la misma revisión de coordinación conserva el valor respondido", () => {
    expect(T04ReadService.availabilityState("YES", 3, 3)).toBe("YES")
    expect(T04ReadService.availabilityState("MAYBE", 3, 3)).toBe("MAYBE")
    expect(T04ReadService.availabilityState("NO", 3, 3)).toBe("NO")
  })

  it("con una revisión anterior deriva NEEDS_RECONFIRMATION", () => {
    expect(T04ReadService.availabilityState("YES", 2, 3)).toBe("NEEDS_RECONFIRMATION")
    expect(T04ReadService.availabilityState("NO", 0, 1)).toBe("NEEDS_RECONFIRMATION")
  })

  it("una revisión superior nunca degrada a NO_RESPONSE", () => {
    expect(T04ReadService.availabilityState("YES", 5, 3)).toBe("YES")
  })
})

describe("T04 — clave de dedupe de NOT-06 (H-05)", () => {
  it("la revisión publicada es obligatoria y forma parte de la clave", () => {
    expect(() => notificationDedupeKey({
      type: "SELECTION_PUBLISHED",
      resourceType: "SELECTION",
      resourceId: "selection-1",
      recipientPersonId: "person-1",
      originEventId: "event-1",
      revisionId: null,
    })).toThrow(AppError)
  })

  it("la clave distingue dos publicaciones legítimas de la misma convocatoria", () => {
    const base = { type: "SELECTION_PUBLISHED" as const, resourceType: "SELECTION" as const, resourceId: "selection-1", recipientPersonId: "person-1", originEventId: "event-1" }
    const first = notificationDedupeKey({ ...base, revisionId: "revision-1" })
    const second = notificationDedupeKey({ ...base, revisionId: "revision-2" })
    expect(first).toBe("selection-1|revision-1|person-1|SELECTION_PUBLISHED")
    expect(second).not.toBe(first)
  })

  it("dos personas distintas del mismo aviso no comparten clave", () => {
    const base = { type: "SELECTION_PUBLISHED" as const, resourceType: "SELECTION" as const, resourceId: "selection-1", originEventId: "event-1", revisionId: "revision-1" }
    expect(notificationDedupeKey({ ...base, recipientPersonId: "person-1" })).not.toBe(notificationDedupeKey({ ...base, recipientPersonId: "person-2" }))
  })

  it("los tipos EVENT conservan su clave con originEventId", () => {
    const key = notificationDedupeKey({ type: "EVENT_CHANGED", resourceType: "EVENT", resourceId: "event-1", recipientPersonId: "person-1", originEventId: "event-1", revisionId: null })
    expect(key).toBe("event-1|EVENT|event-1|person-1|EVENT_CHANGED")
  })
})

describe("T04 — registro de errores del contrato", () => {
  it("mapea los códigos de T04 al status HTTP del contrato", () => {
    expect(httpStatusFor(new AppError("VALIDATION_FAILED", "x", "domain_validation"))).toBe(422)
    expect(httpStatusFor(new AppError("AUTHORITY_DENIED", "x", "authorization"))).toBe(403)
    expect(httpStatusFor(new AppError("NOT_OWN_RESPONSE", "x", "authorization"))).toBe(403)
    expect(httpStatusFor(new AppError("EVENT_NOT_SCHEDULED", "x", "conflict"))).toBe(409)
    expect(httpStatusFor(new AppError("OPTIMISTIC_LOCK_FAILURE", "x", "conflict"))).toBe(409)
    expect(httpStatusFor(new AppError("INVALID_CORRECTION", "x", "conflict"))).toBe(409)
    expect(httpStatusFor(new AppError("SHEET_CLOSED", "x", "conflict"))).toBe(409)
    expect(httpStatusFor(new AppError("RECORD_NOT_DRAFT", "x", "conflict"))).toBe(409)
    expect(httpStatusFor(new AppError("EVENT_NOT_FOUND", "x", "not_found"))).toBe(404)
  })
})
