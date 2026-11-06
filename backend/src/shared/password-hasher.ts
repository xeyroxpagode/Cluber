import argon2 from "argon2"

const FLOOR = { memoryCost: 19 * 1024, timeCost: 2, parallelism: 1 }

export class PasswordHasher {
  async hash(password: string): Promise<string> {
    if ([...password].length < 15 || [...password].length > 128) throw new RangeError("Password length must be between 15 and 128 characters")
    return argon2.hash(password, { type: argon2.argon2id, ...FLOOR })
  }
  async verify(phc: string, password: string): Promise<boolean> {
    try { return await argon2.verify(phc, password) } catch { return false }
  }
  needsRehash(phc: string): boolean { return argon2.needsRehash(phc, FLOOR) }
}
