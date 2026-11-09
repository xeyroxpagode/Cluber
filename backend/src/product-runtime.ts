import type { AppConfig } from "./config/load-config.js"
export interface ProductEnv extends Pick<AppConfig, "environment" | "publicOrigin" | "secrets" | "clubTimeZone"> {}
