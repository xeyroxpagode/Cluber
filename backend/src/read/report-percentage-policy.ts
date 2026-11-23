import type { AttendanceCounts, PresencePercentageDto } from "../../../shared/contracts/t06.js"

/**
 * A-01 (decisión aprobada, delegación expresa de Actor A):
 *   % PRESENCIA = 100 * PRESENT / (PRESENT + ABSENT + JUSTIFIED)
 *   - UNRECORDED queda FUERA del denominador y se reporta como conteo independiente.
 *   - Denominador 0 => value null => "Sin datos" (nunca 0%).
 *   - JUSTIFIED sí reduce el indicador cuando una fila pasa de PRESENT a JUSTIFIED.
 *     El copy de la UI debe decir "presencia física efectiva", NO "JUSTIFIED no penaliza".
 *
 * La referencia residual `ReportPercentagePolicy=NOT_APPROVED` en el contrato §21 E2
 * es histórica y queda resuelta a favor del Product Decision Record (A-01 = A1).
 */
export class ReportPercentagePolicy {
  static readonly status = "APPROVED" as const
  static readonly formulaRef = "A-01" as const

  static computePresencePercentage(counts: AttendanceCounts): PresencePercentageDto {
    const denominator = counts.present + counts.absent + counts.justified
    if (denominator === 0) {
      return { status: this.status, value: null, formulaRef: this.formulaRef }
    }
    return { status: this.status, value: (100 * counts.present) / denominator, formulaRef: this.formulaRef }
  }

  /** Etiqueta canónica — prohibido afirmar que JUSTIFIED "no penaliza". */
  static label(value: number | null): string {
    return value === null ? "Sin datos" : `${value.toFixed(1)}%`
  }
}
