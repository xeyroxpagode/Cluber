import type { Kysely } from "kysely"
import type { AppConfig } from "./config/load-config.js"
import type { DatabaseSchema } from "./db/types.js"
import type { TransactionRunner } from "./db/transaction-runner.js"
import type { RateLimiter } from "./shared/rate-limiter.js"
import type { IdempotencyCoordinator } from "./shared/idempotency-coordinator.js"
import { PasswordHasher } from "./shared/password-hasher.js"
import { PrincipalResolver } from "./iam/session.js"
import { AccountService } from "./iam/account.js"
import { PeopleService } from "./people/people.js"
import { MembershipService } from "./people/membership.js"
import { RoleAssignmentService } from "./people/roles.js"
import { AffiliationService } from "./people/affiliation.js"
import { StructureService } from "./structure/structure.js"
import { ProductReadService } from "./read/product-read.js"
import { T03ReadService } from "./read/t03-read.js"
import { T04ReadService } from "./read/t04-read.js"
import { HomeReadService } from "./read/home-read.js"
import { AttentionReadService } from "./read/attention-read.js"
import { ReportReadService } from "./read/report-read.js"
import { SearchCursor } from "./read/search-cursor.js"
import { SearchReadService } from "./read/search-read.js"
import { ParticipationService } from "./participation/participation.js"
import { EventService } from "./events/events.js"
import { EventSeriesService } from "./events/series.js"
import { JornadaService } from "./jornada/jornada.js"
import { NotificationService } from "./notification/notification.js"
import { AuditWriter, AuditService } from "./audit/audit.js"
import { AuthorityService } from "./authority/authority.js"
import type { RateLimitPolicy } from "./shared/rate-limiter.js"

export interface ProductDeps {
  config: Pick<AppConfig, "environment" | "publicOrigin" | "secrets" | "clubTimeZone">
  database: Kysely<DatabaseSchema>
  runner: TransactionRunner
  rateLimiter: RateLimiter
  idempotencyCoordinator: IdempotencyCoordinator
}

export class ProductServices {
  readonly passwordHasher = new PasswordHasher()
  readonly auditWriter = new AuditWriter()
  readonly auditService = new AuditService()
  readonly authority = new AuthorityService()
  readonly principals: PrincipalResolver
  readonly accounts: AccountService
  readonly people = new PeopleService()
  readonly memberships = new MembershipService()
  readonly roles = new RoleAssignmentService()
  readonly affiliations = new AffiliationService()
  readonly structure = new StructureService()
  readonly reads = new ProductReadService(this.authority)
  readonly t03Reads = new T03ReadService(this.authority)
  readonly participation = new ParticipationService()
  readonly t04Reads = new T04ReadService(this.authority, this.participation)
  /** T06 read models — proyecciones en caliente, sin persistencia paralela. */
  readonly homeReads = new HomeReadService()
  readonly attentionReads = new AttentionReadService()
  readonly searchCursor: SearchCursor
  readonly searchReads: SearchReadService
  readonly reportReads = new ReportReadService()
  readonly events = new EventService()
  readonly eventSeries = new EventSeriesService()
  readonly jornada = new JornadaService()
  readonly notificationService = new NotificationService()

  constructor(readonly deps: ProductDeps) {
    this.principals = new PrincipalResolver(deps.database, deps.config)
    this.accounts = new AccountService(deps.config, this.passwordHasher)
    this.searchCursor = new SearchCursor(deps.config.secrets.csrfHmacSecret.toString("hex"))
    this.searchReads = new SearchReadService(this.searchCursor)
  }

  ratePolicy(name: "PRODUCT_LOGIN" | "PRODUCT_ACTIVATION" | "PRODUCT_EMAIL_CHANGE"): RateLimitPolicy {
    if (name === "PRODUCT_LOGIN") return { name, limit: 5, windowSeconds: 300 }
    if (name === "PRODUCT_ACTIVATION") return { name, limit: 5, windowSeconds: 300 }
    return { name, limit: 5, windowSeconds: 300 }
  }
}
