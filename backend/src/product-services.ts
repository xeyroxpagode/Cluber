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

  constructor(readonly deps: ProductDeps) {
    this.principals = new PrincipalResolver(deps.database, deps.config)
    this.accounts = new AccountService(deps.config, this.passwordHasher)
  }

  ratePolicy(name: "PRODUCT_LOGIN" | "PRODUCT_ACTIVATION" | "PRODUCT_EMAIL_CHANGE"): RateLimitPolicy {
    if (name === "PRODUCT_LOGIN") return { name, limit: 5, windowSeconds: 300 }
    if (name === "PRODUCT_ACTIVATION") return { name, limit: 5, windowSeconds: 300 }
    return { name, limit: 5, windowSeconds: 300 }
  }
}
