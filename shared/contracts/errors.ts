import { Type, type Static } from "@sinclair/typebox"

export const ErrorEnvelopeSchema = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    fieldErrors: Type.Optional(Type.Record(Type.String(), Type.Array(Type.String()))),
    traceId: Type.String({ format: "uuid" }),
    retryable: Type.Boolean(),
  }),
})

export type ErrorEnvelope = Static<typeof ErrorEnvelopeSchema>
