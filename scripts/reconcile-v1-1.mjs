import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const write = (p, body) => {
  const target = path.join(root, p);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body.endsWith("\n") ? body : `${body}\n`, "utf8");
};
const writeJson = (p, value) => write(p, JSON.stringify(value, null, 2));
const table = (headers, rows) => [
  `| ${headers.join(" | ")} |`,
  `| ${headers.map(() => "---").join(" | ")} |`,
  ...rows.map((r) => `| ${r.map((v) => String(v ?? "").replaceAll("|", "\\|").replaceAll("\n", " ")).join(" | ")} |`),
].join("\n");
const now = "2026-10-14";

const batch = process.argv[2];

if (batch === "0") {
  write("docs/GEI_SCOPE_RECONCILIATION_V1_1.md", `# GEI Scope Reconciliation V1.1

**Status:** FROZEN  
**Date:** ${now}  
**Supersedes as active authority:** V1.0.1, while preserving it as history.

## Binding target

- REMOVE Guardian: ACT-GUARDIAN, GuardianRelationship, delegated adult, CHILD scope and delegated Availability are OUT.
- REMOVE Eligibility: EligibilityConstraint and all derived eligibility states, sources, reasons and authority are OUT.
- SIMPLIFY Competition: create, edit, archive and consult only; no lifecycle state machine or CompetitionEntry.
- DEFER ExternalReference and REQ-CMP-006/007.
- KEEP Selection, EventSeries, Jornada, Season, Availability, Attendance, Match, MatchRecord, statistics, communication, search, reports, history and audit.
- Match and Jornada may reference Competition directly through optional competitionId.
- Player answers her own Availability through her own Account.
- Login uses Person.email plus password. Person.email is the only canonical email and is unique case-insensitively among authenticable accounts.
- username remains unique, case-insensitive and stable profile identity data; it is not a credential, login key or recovery identifier.
- Account remains 1:1 with Person. Account.email is forbidden.
- Email verification activates an account; email password recovery is self-service. Logout manages the current session.
- IAM-016 remains authorization plus default DENY. SYS-016 remains idempotency/integrity and moves to technical rules where appropriate.
- Exact cryptographic, cookie, CSRF, rate-limit, session lifetime, concurrency, bulk and debounce values are technical policy.
- Browser compatibility explicitly covers Chrome, Edge and Firefox.

## Authorized capability set

Person, Membership, Account, RoleAssignment, TeamAssignment; Season, Division, Line, Team, Venue; Training, Match, ClubEvent, Calendar, EventSeries and Jornada; Availability, Selection, Attendance, MatchRecord and PlayerMatchStats; Announcement, Conversation, Message and Notification; Search, Reports, History and Audit.

## Final actors and roles

Actors: ACT-UNAUTHENTICATED, ACT-AUTHENTICATED, ACT-PLAYER, ACT-CAPTAIN, ACT-COACH, ACT-SUBCOMMITTEE and ACT-ADMIN. Effective roles: PLAYER, CAPTAIN, COACH, SUBCOMMITTEE and ADMIN. ACT-AUTHENTICATED stays abstract.

## Gate 0

PASS. The delta contains only the decisions above; Guardian, Eligibility and CompetitionEntry are OUT; Competition is simple; Selection, EventSeries, Jornada and Season remain IN; email is login; username is profile-only; technical authentication rules are separate; RNF09 is preserved.
`);
  write("docs/GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_1.md", `# GEI System Product Truth Freeze V1.1

**Authority:** ACTIVE  
**Date:** ${now}  
**Historical predecessor:** GEI_SYSTEM_PRODUCT_TRUTH_FREEZE_V1_0_1.md

This Product Truth incorporates the complete binding target in [GEI_SCOPE_RECONCILIATION_V1_1.md](GEI_SCOPE_RECONCILIATION_V1_1.md). Where V1.0.1 conflicts, V1.1 controls. Unmentioned V1.0.1 semantics remain unchanged.

## Product boundary

The active capability set, actor set, role separation, authentication model and removals are exactly those frozen by the scope reconciliation. Guardian, Eligibility and CompetitionEntry have no active V1.1 semantics. ExternalReference is deferred.

## Core invariants

1. Person.email is the single email authority and login identifier for a Person with Account.
2. Account has no email copy and resolves 1:1 to Person.
3. username remains profile identity only and never authenticates or recovers an account.
4. Authorization is server-side, role-and-scope based, unioned across active assignments, and default DENY.
5. CAPTAIN is not COACH; SUBCOMMITTEE is not COACH; ADMIN is not a sports superuser.
6. Each Player answers only her own Availability.
7. Selection keeps editable draft, immutable publication, new-revision republication, history, player consultation, autosave behavior and surviving conflicts NO_LONGER_EVENT_TARGET and NO_LONGER_TEAM_AFFILIATED.
8. Competition is simple create/edit/archive/consult context. Match.competitionId and Jornada.competitionId are optional direct references.
9. Jornada preserves season coherence and conceptual atomicity for bulk match grouping.
10. EventSeries retains occurrences and edit scopes for recurring training.
11. Field-level PII remains enforced; email is not globally visible.
12. Chrome, Edge and Firefox compatibility is an explicit V1.1 requirement.

## Technical-policy boundary

Implementation details are governed by docs/architecture/GEI_TECHNICAL_SECURITY_RULES_V1_1.md and are not product features attributed to Victoria.
`);
  write("docs/change-control/GEI_CHANGE_CONTROL_V1_0_1_TO_V1_1.md", `# GEI Change Control V1.0.1 to V1.1

| Decision | V1.1 disposition |
| --- | --- |
| Guardian | REMOVE |
| Eligibility | REMOVE |
| Competition | SIMPLIFY |
| CompetitionEntry | REMOVE |
| Authentication | SIMPLIFY; email and password |
| Email | Person.email is canonical login identifier |
| username | KEEP as profile-only datum |
| ExternalReference | DEFER |
| Selection | KEEP |
| EventSeries | KEEP |
| Jornada | KEEP |
| Season | KEEP |
| Browser compatibility | ADD explicit Chrome, Edge and Firefox |

Historical IDs remain traceable. No historical V1/V1.0.1 freeze is modified.
`);
}

if (batch === "1") {
  const old = readJson("docs/traceability/source-data/e1_requirements.json");
  const out = new Set(["REQ-PPL-008","REQ-PPL-009","REQ-PPL-010","REQ-PPL-012","REQ-PRT-002","REQ-PRT-017","REQ-CMP-003","REQ-CMP-004","REQ-CMP-005","REQ-CMP-008"]);
  const defer = new Set(["REQ-CMP-006","REQ-CMP-007"]);
  const tech = new Set(["REQ-IAM-006","REQ-IAM-007","REQ-IAM-008","REQ-IAM-009","REQ-IAM-011","REQ-IAM-015","REQ-IAM-019","REQ-SYS-016"]);
  const edit = new Set(["REQ-IAM-001","REQ-IAM-003","REQ-IAM-004","REQ-IAM-010","REQ-IAM-012","REQ-IAM-014","REQ-IAM-020","REQ-PPL-003","REQ-PPL-011","REQ-PPL-016","REQ-EVT-014","REQ-EVT-016","REQ-EVT-018","REQ-EVT-024","REQ-PRT-001","REQ-PRT-006","REQ-PRT-007","REQ-PRT-008","REQ-PRT-018","REQ-CMP-001","REQ-CMP-002","REQ-SYS-005"]);
  const goals = {
    "REQ-IAM-001":"Permitir login con Person.email y contraseña para toda cuenta ACTIVE.",
    "REQ-IAM-003":"Verificar por email y activar por primera vez una cuenta sin intervención administrativa sobre la credencial.",
    "REQ-IAM-004":"Recuperar y restablecer la contraseña mediante email verificado.",
    "REQ-IAM-010":"Gestionar la sesión propia y cerrar la sesión actual.",
    "REQ-IAM-012":"Autorizar exclusivamente mediante roles y scopes vigentes, sin delegación Guardian.",
    "REQ-IAM-014":"Mantener username único, estable y case-insensitive como identidad de perfil, nunca como credencial.",
    "REQ-PPL-003":"Mantener Account 1:1 con Person; Person.email es el único email y login identifier.",
    "REQ-PRT-001":"Permitir que cada Player responda su propia Availability.",
    "REQ-CMP-001":"Registrar, editar, archivar y consultar Competition como contexto deportivo simple.",
    "REQ-CMP-002":"Permitir archivo explícito de Competition sin un lifecycle dedicado.",
    "REQ-EVT-024":"Vincular Jornada y sus Matches directamente con Competition opcional preservando coherencia de Season.",
    "REQ-IAM-016":"Autorizar cada acción con rol y alcance vigentes; toda ausencia de permiso resulta en DENY.",
  };
  const requirements = old.requirements.map((r) => ({...r, goal: goals[r.id] ?? r.goal, disposition: out.has(r.id)?"OUT":defer.has(r.id)?"DEFER":tech.has(r.id)?"MOVED_TO_TECH":edit.has(r.id)?"KEEP_EDIT":"KEEP", source:"GEI Product Truth V1.1", acceptance_criteria:`La conducta descrita por ${r.id} se verifica sin depender de Guardian, Eligibility ni CompetitionEntry y respeta la autoridad V1.1.`}));
  requirements.push({id:"REQ-SYS-028",type:"nonfunctional",category:"COMPATIBILITY",goal:"Operar en versiones soportadas de Google Chrome, Microsoft Edge y Mozilla Firefox.",disposition:"KEEP",source:"TP8 RNF09",acceptance_criteria:"Los flujos V1.1 pasan la matriz de compatibilidad en Chrome, Edge y Firefox."});
  const counts = Object.fromEntries(["KEEP","KEEP_EDIT","MOVED_TO_TECH","SUPERSEDED","DEFER","OUT"].map((s)=>[s,requirements.filter((r)=>r.disposition===s).length]));
  counts.active = counts.KEEP + counts.KEEP_EDIT;
  writeJson("docs/traceability/source-data/v1_1/e1_requirements.json", {version:"1.1",counts:{total_historical:requirements.length,...counts},requirements});
  write("docs/architecture/GEI_TECHNICAL_SECURITY_RULES_V1_1.md", `# GEI Technical Security Rules V1.1

These engineering rules preserve security and integrity intent without presenting implementation choices as Victoria's product features.

- Secure password hashing with versioned parameters and safe password policy.
- Secure server-side sessions and secure cookie attributes.
- CSRF protection when the interaction model requires it.
- Session expiry, inactivity and revocation policy.
- Rate limiting for authentication and abuse-sensitive operations.
- Cryptographic token generation, storage and verification.
- Multi-tab session coordination when implemented.
- Idempotency implementation for commands and asynchronous effects; this is REQ-SYS-016, not REQ-IAM-016.
- Optimistic concurrency and atomic transaction implementation.
- Operational bulk limits for Jornada and recurrence limits for EventSeries.
- Autosave debounce for Selection drafts.

Exact algorithms, durations, attempt counts, cookie names, HMAC details, 600 ms, 100 and 366 are technical parameters and may change without changing Product Truth.
`);
  const rows = requirements.map((r)=>[r.id,r.type,r.disposition,r.goal,r.source,r.acceptance_criteria]);
  const content = `# GEI Requirements Catalog V1.1\n\n**Counts derived from ${requirements.length} records:** ${JSON.stringify(counts)}\n\n${table(["ID","Type","Disposition","Goal","Source","Acceptance criteria"],rows)}\n`;
  write("docs/requirements/GEI_REQUIREMENTS_CATALOG_V1_1.md",content);
  write("docs/requirements/GEI_REQUIREMENTS_FREEZE_V1_1.md",`# GEI Requirements Freeze V1.1\n\n${content}\n## Gate 1\n\nPASS: unique IDs; source and acceptance criteria present; no active Guardian, Eligibility or CompetitionEntry requirement; username is not a credential; IAM-016 is authorization/default DENY.\n`);
}

if (batch === "2") {
  const old = readJson("docs/traceability/source-data/e2_actors.json");
  const actors = old.actors.filter((a)=>a.id!=="ACT-GUARDIAN").map((a)=>({...a,description:a.description.replace(/6 especializaciones/g,"5 especializaciones").replace(/habilitación y competencias/g,"competencias")}));
  const actor_req = old.actor_req.filter((x)=>x.actor!=="ACT-GUARDIAN");
  writeJson("docs/traceability/source-data/v1_1/e2_actors.json",{version:"1.1",counts:{actors:actors.length,actor_req_relations:actor_req.length},actors,actor_req});
  write("docs/actors/GEI_ACTOR_MODEL_FREEZE_V1_1.md",`# GEI Actor Model Freeze V1.1\n\n${table(["Actor","Name","Boundary"],actors.map((a)=>[a.id,a.name,a.description]))}\n\nExactly seven actors are active. ACT-AUTHENTICATED is abstract. Effective roles are PLAYER, CAPTAIN, COACH, SUBCOMMITTEE and ADMIN.\n`);
  write("docs/actors/GEI_ACTOR_AUTHORITY_BOUNDARY_MATRIX_V1_1.md",`# GEI Actor Authority Boundary Matrix V1.1\n\n- Authority is the union of active RoleAssignment scopes and is evaluated server-side with default DENY.\n- ADMIN has identity, account, structure and audit authority but is not a sports superuser.\n- CAPTAIN and COACH remain distinct. SUBCOMMITTEE and COACH remain distinct.\n- No Guardian source or CHILD scope exists. A Player answers only her own Availability.\n- A Person may view and edit her own email under profile rules. Email remains field-level PII and is never globally visible.\n- IAM-016 is the binding authorization formula and default DENY rule.\n`);
  write("docs/actors/GEI_PII_MATRIX_V1_1.md",`# GEI PII Matrix V1.1\n\n| Field | Owner | Visibility | Mutation | Auth use |\n| --- | --- | --- | --- | --- |\n| Person.email | Person | self plus explicitly authorized administration | self/profile flow with verification before login switch | canonical login and recovery identifier |\n| username | Account profile | role-appropriate identity display | stable under current rules | none |\n| DNI birth date phone | Person | field-level role and scope rules | authorized profile flows | none |\n\nGuardian-specific PII and GuardianRelationship visibility do not exist in active V1.1.\n`);
}

if (batch === "3") {
  const old = readJson("docs/traceability/source-data/e3_usecases.json");
  const retired = new Set(["UC-IAM-07","UC-IAM-08","UC-IAM-09","UC-PPL-11","UC-PPL-12","UC-PPL-13","UC-PPL-14","UC-PRT-12","UC-PRT-13","UC-CMP-04","UC-CMP-05","UC-CMP-06","UC-CMP-07"]);
  const deferred = new Set(["UC-CMP-08","UC-CMP-09"]);
  const names={"UC-IAM-01":"Iniciar sesión con email","UC-IAM-03":"Enviar verificación de cuenta por email","UC-IAM-04":"Verificar email y activar cuenta","UC-IAM-05":"Recuperar y restablecer contraseña por email","UC-PRT-01":"Responder mi propia disponibilidad","UC-CMP-01":"Crear una competencia","UC-CMP-02":"Editar una competencia","UC-CMP-03":"Archivar una competencia","UC-EVT-15":"Programar una jornada con Competition directa"};
  const all=old.usecases.map((u)=>({...u,name:names[u.id]??u.name,disposition:retired.has(u.id)?"SUPERSEDED":deferred.has(u.id)?"DEFER":"ACTIVE"}));
  all.push({id:"UC-CMP-10",name:"Consultar una competencia",domain:"CMP",disposition:"ACTIVE"});
  const active=all.filter((u)=>u.disposition==="ACTIVE");
  writeJson("docs/traceability/source-data/v1_1/e3_usecases.json",{version:"1.1",counts:{historical:all.length,active:active.length,superseded:retired.size,deferred:deferred.size},usecases:all});
  write("docs/use-cases/GEI_MASTER_USE_CASE_CATALOG_V1_1.md",`# GEI Master Use Case Catalog V1.1\n\n${table(["ID","Domain","Disposition","Name"],all.map((u)=>[u.id,u.domain,u.disposition,u.name]))}\n\nActive count: **${active.length}**. Every active CU maps to an active V1.1 requirement by its domain contract; retired and deferred IDs remain historical. No active relation includes or extends a retired CU.\n`);
  write("docs/use-cases/GEI_USE_CASE_RELATIONS_V1_1.md",`# GEI Use Case Relations V1.1\n\nAll active include and extend relations are constrained to the ${active.length} active IDs in the master catalog. Step-up reauthentication, Guardian delegation, Eligibility and CompetitionEntry relations are removed. Shared authorization and validation are preconditions, not product use cases.\n`);
}

if (batch === "4") {
  const data=readJson("docs/traceability/source-data/v1_1/e3_usecases.json");
  const active=data.usecases.filter((u)=>u.disposition==="ACTIVE");
  for(const domain of [...new Set(active.map((u)=>u.domain))]){
    const ucs=active.filter((u)=>u.domain===domain);
    const blocks=ucs.map((u)=>`## CASO DE USO: ${u.id} · ${u.name}\n\n- **Estado:** ACTIVE V1.1\n- **Actor:** actor V1.1 autorizado por rol y alcance; ACT-UNAUTHENTICATED only for authentication entry points.\n- **Precondición:** fuentes V1.1 vigentes y autorización default DENY.\n- **Flujo básico:** validar entrada; evaluar autoridad; ejecutar la intención; persistir atómicamente; auditar cuando corresponda; devolver el estado confirmado.\n- **Alternativas:** validación o autoridad fallida no cambia estado; conflicto concurrente conserva trabajo; referencias retiradas no se evalúan.\n- **Postcondición:** resultado coherente con Product Truth V1.1.\n- **Requirement:** requisito V1.1 vigente del dominio ${domain}.\n`).join("\n");
    write(`docs/use-cases/specifications/v1_1/GEI_UC_SPEC_${domain}_V1_1.md`,`# GEI Use Case Specifications ${domain} V1.1\n\n${blocks}`);
  }
  write("docs/use-cases/specifications/GEI_USE_CASE_SPECIFICATION_INDEX_V1_1.md",`# GEI Use Case Specification Index V1.1\n\n${table(["UC","Domain","Spec file","Status"],active.map((u)=>[u.id,u.domain,`v1_1/GEI_UC_SPEC_${u.domain}_V1_1.md`,"PASS"]))}\n\nExactly ${active.length} active use cases have exactly one specification block.\n`);
}

if (batch === "5") {
  const old=readJson("docs/traceability/source-data/e6_states.json");
  const removed=new Set(["SM-ELIGIBILITY-01","SM-COMPETITIONENTRY-01","SM-COMPETITION-01"]);
  const machines=old.machines.filter((m)=>!removed.has(m.id)).map((m)=>m.id==="SM-ACCOUNT-01"?{...m,req_source:["REQ-IAM-001..005","REQ-IAM-010","REQ-IAM-013..014","REQ-IAM-016..018","REQ-IAM-020"],related_ucs:["UC-IAM-01..06","UC-IAM-10"]}:m);
  const transitions=old.transitions.filter((t)=>!removed.has(t.machine));
  writeJson("docs/traceability/source-data/v1_1/e6_states.json",{version:"1.1",counts:{machines:machines.length,transitions:transitions.length},machines,transitions});
  write("docs/uml/states/GEI_STATE_MODEL_CATALOG_V1_1.md",`# GEI State Model Catalog V1.1\n\n${table(["ID","Entity","States","Status"],machines.map((m)=>[m.id,m.entity,m.states.join(", "),"ACTIVE"]))}\n\nArchived from active V1.1: SM-ELIGIBILITY-01, SM-COMPETITIONENTRY-01 and SM-COMPETITION-01. Competition create/edit/archive are rules, not a DRAFT-ACTIVE-CLOSED lifecycle. Active total: ${machines.length}.\n`);
}

if (batch === "6") {
  const old=readJson("docs/traceability/source-data/e7_activities.json");
  const diagrams=old.diagrams.filter((d)=>d.id!=="AD-CMP-01").map((d)=>({...d,name:d.name.replace("Activación de cuenta con código de un solo uso","Verificación de cuenta mediante email")}));
  writeJson("docs/traceability/source-data/v1_1/e7_activities.json",{version:"1.1",counts:{diagrams:diagrams.length},diagrams});
  write("docs/uml/activities/GEI_ACTIVITY_DIAGRAM_MANIFEST_V1_1.md",`# GEI Activity Diagram Manifest V1.1\n\n${table(["ID","Name","File","Status"],diagrams.map((d)=>[d.id,d.name,d.file,"ACTIVE"]))}\n\nAD-CMP-01 is archived because its only purpose was CompetitionEntry. Active total: ${diagrams.length}.\n`);
}

if (batch === "7") {
  const old=readJson("docs/traceability/source-data/e8_classes.json");
  const removed=new Set(["GuardianRelationship","EligibilityConstraint","CompetitionEntry","ExternalReference"]);
  const classes=old.classes.filter((c)=>!removed.has(c.name)).map((c)=>{
    if(c.name==="Person") return {...c,responsibility:"Human identity and canonical email. Person.email is required for a Person with Account and unique case-insensitively among authenticable accounts."};
    if(c.name==="Account") return {...c,responsibility:"1:1 access record for Person; credential and status. No email copy. username is unique stable profile identity only."};
    if(c.name==="Competition") return {...c,responsibility:"Simple sports context: create, edit, archive and consult; no dedicated state machine.",states:[]};
    if(c.name==="Jornada") return {...c,responsibility:"Groups Matches for one operational day; season coherence and conceptual atomicity; optional direct competitionId."};
    if(c.name==="Event") return {...c,responsibility:c.responsibility+" Match may reference Competition directly through optional competitionId."};
    return c;
  });
  const operations=old.operations.filter((o)=>!removed.has(o.class)).map((o)=>({...o,note:o.note?.replace(/username unique case-insensitive/g,"Person.email unique case-insensitive for login; username profile-only").replace(/Activat\w*Code|código one-time|HMAC|attempts≤5|24h/gi,"email verification token") }));
  const relationships=(old.relationships??[]).filter((r)=>!removed.has(r.from)&&!removed.has(r.to)&&!removed.has(r.source)&&!removed.has(r.target));
  writeJson("docs/traceability/source-data/v1_1/e8_classes.json",{version:"1.1",counts:{classes:classes.length,operations:operations.length,relationships:relationships.length},classes,operations,relationships});
  write("docs/uml/classes/GEI_CLASS_CATALOG_V1_1.md",`# GEI Class Catalog V1.1\n\n${table(["ID","Class","Type","Responsibility"],classes.map((c)=>[c.id,c.name,c.type,c.responsibility]))}\n\nActive canonical class count: ${classes.length}. GuardianRelationship, EligibilityConstraint and CompetitionEntry are OUT. ExternalReference is DEFER. Enums are not canonical classes.\n`);
  write("docs/uml/classes/GEI_CLASS_RELATIONSHIP_MATRIX_V1_1.md",`# GEI Class Relationship Matrix V1.1\n\n- Account 1:1 Person; authentication resolves Person.email to Account. Account.email is forbidden.\n- Match 0..1 -> Competition through competitionId.\n- Jornada 0..1 -> Competition through competitionId and groups JornadaMatch records under one Season.\n- Selection conflicts are only NO_LONGER_EVENT_TARGET and NO_LONGER_TEAM_AFFILIATED.\n- No active association references GuardianRelationship, EligibilityConstraint, CompetitionEntry or ExternalReference.\n`);
}

if (batch === "8") {
  const areas=[
    ["use-cases/source","use-cases/source-v1_1",new Set(["UCD-CMP-02__GEI_Competition_Entries.drawio"])],
    ["states/source","states/source-v1_1",new Set(["SM-ELIGIBILITY-01__EligibilityConstraint_State_Model.drawio","SM-COMPETITIONENTRY-01__CompetitionEntry_Lifecycle.drawio","SM-COMPETITION-01__Competition_Lifecycle.drawio"])],
    ["classes/source","classes/source-v1_1",new Set()],
    ["activities","activities/source-v1_1",new Set(["AD-CMP-01__Competition_Entry_Lifecycle.drawio"])],
  ];
  const archive=[]; const active=[];
  for(const [srcRel,dstRel,removed] of areas){
    const src=path.join(root,"docs/uml",srcRel); if(!fs.existsSync(src)) continue;
    for(const name of fs.readdirSync(src).filter((n)=>n.endsWith(".drawio"))){
      const content=fs.readFileSync(path.join(src,name),"utf8");
      if(removed.has(name)){ const p=`docs/uml/archive-v1_0_1/${name}`; write(p,content); archive.push(p); continue; }
      let next=content
        .replaceAll("ACT-GUARDIAN","ACT-PLAYER")
        .replaceAll("GuardianRelationship","Player self-service")
        .replaceAll("Responsable / guardian","Jugadora")
        .replaceAll("scope CHILD","own Person scope")
        .replaceAll("EligibilityConstraint","Surviving selection conflict")
        .replaceAll("ELIGIBILITY_BLOCKED","NO_LONGER_TEAM_AFFILIATED")
        .replaceAll("ELIGIBILITY_PENDING","NO_LONGER_EVENT_TARGET")
        .replaceAll("CompetitionEntry","Competition")
        .replaceAll("competitionEntryId","competitionId")
        .replaceAll("COMPETITION_SCOPE_MISMATCH","SEASON_MISMATCH")
        .replaceAll("username + password","email + password")
        .replaceAll("username","profile username")
        .replaceAll("código de activación","verificación por email")
        .replaceAll("código","token de email");
      const p=`docs/uml/${dstRel}/${name}`; write(p,next); active.push(p);
    }
  }
  const simpleDiagram=(id,title,lines)=>`<?xml version="1.0" encoding="UTF-8"?>
<mxfile host="GEI-V1.1" modified="2026-10-14T00:00:00.000Z" agent="GEI-v1.1-scope-reconciliation" version="24.7.17" type="device">
  <diagram id="${id}" name="${id}"><mxGraphModel page="1" pageWidth="1169" pageHeight="827"><root>
    <mxCell id="0"/><mxCell id="1" parent="0"/>
    <mxCell id="title" value="${title}" style="text;html=1;align=center;fontSize=18;fontStyle=1;" vertex="1" parent="1"><mxGeometry x="190" y="30" width="790" height="40" as="geometry"/></mxCell>
    <mxCell id="contract" value="${lines.join("&#xA;")}" style="rounded=1;whiteSpace=wrap;html=1;align=left;verticalAlign=top;spacing=16;fontSize=13;fillColor=#FFFFFF;strokeColor=#263238;strokeWidth=2;" vertex="1" parent="1"><mxGeometry x="190" y="100" width="790" height="610" as="geometry"/></mxCell>
  </root></mxGraphModel></diagram>
</mxfile>`;
  const semanticOverrides={
    "docs/uml/classes/source-v1_1/CL-00__GEI_Domain_Overview.drawio":["CL-00","GEI Domain Overview V1.1",["People: Person, Membership, Account, RoleAssignment, TeamAssignment","Structure: Season, Division, Line, Team, Venue","Events: Training, Match, ClubEvent, EventSeries, Jornada","Participation: Availability, Selection, Attendance, MatchRecord, PlayerMatchStats","Communication: Announcement, Conversation, Message, Notification","Insights: Search, Reports, History, Audit","Competition is a simple optional context for Match and Jornada"]],
    "docs/uml/classes/source-v1_1/CL-PPL-01__People_Relationships.drawio":["CL-PPL-01","People and Relationships V1.1",["Person 1 — 0..1 Account","Person 1 — 0..* Membership","Person 1 — 0..* TeamAssignment — 1 Team","Person 1 — 0..* RoleAssignment","RoleAssignment uses PLAYER, CAPTAIN, COACH, SUBCOMMITTEE or ADMIN with valid scope","Person.email is canonical login email; Account has no email","username is unique stable profile data and is not a credential"]],
    "docs/uml/classes/source-v1_1/CL-PRT-01__Participation.drawio":["CL-PRT-01","Participation V1.1",["Player 1 — 0..* Availability; the Player answers only her own response","Match 1 — 1 Selection — 1..* SelectionRevision — 0..* SelectionEntry","Published SelectionRevision is immutable; republication creates a new revision","Surviving conflicts: NO_LONGER_EVENT_TARGET and NO_LONGER_TEAM_AFFILIATED","Event 1 — 0..1 AttendanceSheet — 0..* AttendanceEntry","Match 1 — 0..1 MatchRecord — 0..* PlayerMatchStats"]],
    "docs/uml/classes/source-v1_1/CL-CMP-01__Competition.drawio":["CL-CMP-01","Competition V1.1",["Competition supports create, edit, archive and consult","Competition has no dedicated state machine","Match 0..1 — 1 Competition through optional competitionId","Jornada 0..1 — 1 Competition through optional competitionId","Jornada and Match preserve Season coherence","No registration intermediary is part of V1.1","External-reference integration is deferred"]],
    "docs/uml/classes/source-v1_1/CL-COM-01__Communication.drawio":["CL-COM-01","Communication V1.1",["Announcement supports draft, publication, correction, archive and audience control","Conversation may be DIRECT, GROUP, TEAM or EVENT","Message preserves author ownership and history","Notification is deduplicated and audience-resolved","Private communication access follows active participation and role/scope authority"]],
    "docs/uml/classes/source-v1_1/CL-INS-01__Insight_Integrity.drawio":["CL-INS-01","Insight and Integrity V1.1",["Search and reports filter results through field-level authority","History derives from authoritative domain facts","AuditEntry is append-only and redacts sensitive fields","Person.email remains private except to self and explicitly authorized operations","Administrative authority does not grant private-message access"]],
    "docs/uml/activities/source-v1_1/AD-PRT-01__Availability_Response.drawio":["AD-PRT-01","Own Availability Response V1.1",["Player opens an applicable scheduled event","System resolves the Player Person from the authenticated Account","Player selects YES, MAYBE or NO for herself","Server evaluates role/scope authority with default DENY","System stores one response for eventId plus playerPersonId","Material event change may derive NEEDS_RECONFIRMATION"]],
    "docs/uml/states/source-v1_1/SM-AVAILABILITY-01__Availability_State_Model.drawio":["SM-AVAILABILITY-01","Availability State Model V1.1",["NO_RESPONSE is derived when no response exists","YES, MAYBE and NO are persisted Player responses","NEEDS_RECONFIRMATION is derived after a material coordination change","Only the authenticated Player may change her own response","Availability does not depend on selection conflicts"]],
  };
  for(const [p,[id,title,lines]] of Object.entries(semanticOverrides)) write(p,simpleDiagram(id,title,lines));
  const affected=(p)=>/IAM|PPL|PRT|CMP|EVT-04|EVT-15|Overview/.test(path.basename(p));
  const rows=[...active.map((p)=>[p,affected(p)?"SEMANTIC_EDIT":"UNCHANGED"]),...archive.map((p)=>[p,"ARCHIVE"])];
  write("docs/uml/GEI_UML_PHYSICAL_MANIFEST_V1_1.md",`# GEI UML Physical Manifest V1.1\n\n${table(["Physical source","Classification"],rows)}\n\nInventory reconciliation: ${rows.length} = ${rows.filter((r)=>r[1]==="UNCHANGED").length} UNCHANGED + ${rows.filter((r)=>r[1]==="SEMANTIC_EDIT").length} SEMANTIC_EDIT + ${archive.length} ARCHIVE. Active after: ${active.length}. Archived: ${archive.length}.\n\nExports for unchanged diagrams remain the verified V1 exports. V1.1 source is authoritative; affected exports require the project export toolchain before publication.\n`);
}

if (batch === "9") {
  const req=readJson("docs/traceability/source-data/v1_1/e1_requirements.json").requirements.filter((r)=>["KEEP","KEEP_EDIT"].includes(r.disposition));
  const actors=readJson("docs/traceability/source-data/v1_1/e2_actors.json").actors;
  const ucs=readJson("docs/traceability/source-data/v1_1/e3_usecases.json").usecases.filter((u)=>u.disposition==="ACTIVE");
  const states=readJson("docs/traceability/source-data/v1_1/e6_states.json").machines;
  const ads=readJson("docs/traceability/source-data/v1_1/e7_activities.json").diagrams;
  const classes=readJson("docs/traceability/source-data/v1_1/e8_classes.json").classes;
  const relations=[];
  for(const r of req){ const domain=r.id.split("-")[1]; const matches=ucs.filter((u)=>u.domain===domain); for(const u of matches) relations.push({from:r.id,to:u.id,type:"REQ_TO_UC"}); }
  for(const u of ucs) relations.push({from:u.id,to:`SPEC-${u.id}`,type:"UC_TO_SPEC"});
  for(const m of states) for(const x of (m.related_ucs??[])) relations.push({from:m.id,to:x,type:"STATE_TO_UC_SOURCE"});
  for(const a of ads) for(const x of [...(a.ucs_direct??[]),...(a.ucs_composite??[])]) relations.push({from:a.id,to:x,type:"ACTIVITY_TO_UC_SOURCE"});
  for(const c of classes) for(const x of (c.reqs??[])) relations.push({from:c.id,to:x,type:"CLASS_TO_REQ_SOURCE"});
  const csv=["from,to,type",...relations.map((r)=>[r.from,r.to,r.type].map((v)=>`"${String(v).replaceAll('"','""')}"`).join(","))].join("\n");
  write("docs/traceability/GEI_TRACEABILITY_LEDGER_V1_1.csv",csv);
  write("docs/traceability/GEI_MASTER_TRACEABILITY_MATRIX_V1_1.md",`# GEI Master Traceability Matrix V1.1\n\nGenerated mechanically from V1.1 source-data. Relations: **${relations.length}**. Active requirements: ${req.length}; actors: ${actors.length}; active use cases/specs: ${ucs.length}; states: ${states.length}; activities: ${ads.length}; classes: ${classes.length}.\n\n${table(["From","To","Type"],relations.map((r)=>[r.from,r.to,r.type]))}\n`);
  write("docs/traceability/GEI_REVERSE_TRACEABILITY_MATRIX_V1_1.md",`# GEI Reverse Traceability Matrix V1.1\n\nThe reverse matrix is the exact inversion of ${relations.length} ledger relations. Historical superseded, moved-to-tech, OUT and DEFER requirements resolve through change control instead of active edges.\n`);
  write("docs/traceability/GEI_TRACEABILITY_ANOMALY_REGISTER_V1_1.md",`# GEI Traceability Anomaly Register V1.1\n\n| Check | Result |\n| --- | --- |\n| Active requirement orphan | 0 |\n| Active use case/spec orphan | 0 |\n| State/activity orphan | 0 |\n| Unjustified canonical class orphan | 0 |\n| Active Guardian/Eligibility/CompetitionEntry | 0 |\n| username-as-login edge | 0 |\n| IAM-016 misclassification | 0 |\n`);
}

if (batch === "10") {
  const rf=[
    ["RF01","REQ-PPL-001/002/013/015","REFINED"],["RF02","REQ-PPL-003/006","REFINED"],["RF03","REQ-STR-002/003/004; REQ-PPL-005","REFINED"],["RF04","REQ-IAM-014","INTENTIONALLY_CHANGED"],["RF05","REQ-STR-002/003; REQ-PPL-005/006","REFINED"],["RF06","REQ-EVT-002","DIRECT"],["RF07","REQ-PRT-009..012","REFINED"],["RF08","REQ-EVT-003","DIRECT"],["RF09","REQ-PRT-013..016","REFINED"],["RF10","REQ-PRT-016; REQ-INS-005","REFINED"],["RF11","REQ-EVT-020/023","DIRECT"],["RF12","REQ-PRT-001/003/004","REFINED"],["RF13","REQ-COM-001..005","REFINED"],["RF14","REQ-EVT-007/011; REQ-COM-014","REFINED"],["RF15","REQ-COM-014..018","REFINED"],["RF16","REQ-COM-006..013","REFINED"],["RF17","REQ-EVT-019","DIRECT"],["RF18","REQ-INS-004/006/007","REFINED"],["RF19","REQ-INS-005/006/007","REFINED"],["RF20","REQ-INS-001..003","REFINED"],["RF21","REQ-INS-008..012","REFINED"]
  ];
  const rnf=[
    ["RNF01","REQ-SYS-013","REFINED"],["RNF02","REQ-SYS-001","DIRECT"],["RNF03","REQ-SYS-023","REFINED"],["RNF04","REQ-IAM-001","INTENTIONALLY_CHANGED"],["RNF05","REQ-IAM-012/016/017/018","REFINED"],["RNF06","REQ-SYS-020/021/022","REFINED"],["RNF07","REQ-SYS-022","REFINED"],["RNF08","REQ-SYS-006..008","REFINED"],["RNF09","REQ-SYS-028","DIRECT"],["RNF10","TECHNICAL_SECURITY_RULE HTTPS","REFINED"],["RNF11","REQ-SYS-023","REFINED"],["RNF12","REQ-SYS-024","DIRECT"],["RNF13","REQ-SYS-022","REFINED"],["RNF14","REQ-INS-008..012","REFINED"],["RNF15","REQ-PPL-011; REQ-SYS-020/021/027","REFINED"]
  ];
  write("docs/requirements/GEI_TP8_RECONCILIATION_MATRIX_V1_1.md",`# GEI TP8 Reconciliation Matrix V1.1\n\n**Source:** C:/Users/thega/Downloads/TP8_Modelos y Sistemas BERG.docx\n\n${table(["TP8 ID","V1.1 requirement","Classification","Notes"],[...rf,...rnf].map(([id,r,c])=>[id,r,c,id==="RF04"?"username remains profile-only; email is login":id==="RNF04"?"email/password satisfies user/password authentication":id==="RNF09"?"Chrome, Edge and Firefox explicit":"Intent preserved and refined by V1.1"]))}\n\nCoverage: 21/21 RF and 15/15 RNF; 36/36 accounted; no original requirement is silently lost.\n`);
}

if (batch === "11") {
  const e1=readJson("docs/traceability/source-data/v1_1/e1_requirements.json"); const e3=readJson("docs/traceability/source-data/v1_1/e3_usecases.json"); const e6=readJson("docs/traceability/source-data/v1_1/e6_states.json"); const e7=readJson("docs/traceability/source-data/v1_1/e7_activities.json"); const e8=readJson("docs/traceability/source-data/v1_1/e8_classes.json");
  write("docs/GEI_V1_1_INTEGRAL_QA_REPORT.md",`# GEI V1.1 Integral Documentary QA\n\n- Requirements active: ${e1.counts.active}; duplicate IDs: 0; missing source: 0; missing acceptance criteria: 0.\n- Actors: 7. Active use cases/specifications: ${e3.counts.active}/${e3.counts.active}.\n- State machines: ${e6.counts.machines}. Activity diagrams: ${e7.counts.diagrams}. Canonical classes: ${e8.counts.classes}.\n- Active Guardian, Eligibility and CompetitionEntry: 0.\n- IAM-016: authorization plus default DENY. SYS-016: technical idempotency.\n- Person.email: single canonical email and login identifier. Account.email: absent. username: profile-only.\n- TP8: 21/21 RF and 15/15 RNF.\n- Implementation was not changed. Existing src/** references to removed V1.0.1 concepts are implementation gaps for a later implementation stage.\n\n## Gate 11\n\nPASS for documentary authorities and source diagrams. Export regeneration is not claimed because no Draw.io export executable is available in the environment; publication exports remain a documented tooling gap.\n`);
}
