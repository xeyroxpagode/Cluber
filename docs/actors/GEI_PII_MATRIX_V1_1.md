# GEI PII Matrix V1.1

| Field | Owner | Visibility | Mutation | Auth use |
| --- | --- | --- | --- | --- |
| Person.email | Person | self plus explicitly authorized administration | self/profile flow with verification before login switch | canonical login and recovery identifier |
| username | Account profile | role-appropriate identity display | stable under current rules | none |
| DNI birth date phone | Person | field-level role and scope rules | authorized profile flows | none |

Guardian-specific PII and GuardianRelationship visibility do not exist in active V1.1.
