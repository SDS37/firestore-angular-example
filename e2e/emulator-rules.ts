import { readFileSync } from 'node:fs';

const projectId = 'demo-fir-example-app';
const rulesUrl = `http://127.0.0.1:8080/emulator/v1/projects/${projectId}:securityRules`;

export const denyWrites = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if false;
    }
  }
}
`;

export function ownerRules(): string {
  return readFileSync('firestore.rules', 'utf8');
}

export async function setFirestoreRules(rules: string): Promise<void> {
  const response = await fetch(rulesUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rules: {
        files: [{ content: rules }]
      }
    })
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
}

export async function createAuthUser(email: string, password: string): Promise<void> {
  const response = await fetch(
    'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    }
  );
  if (!response.ok) {
    throw new Error(await response.text());
  }
}
