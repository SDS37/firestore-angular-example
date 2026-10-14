// firebase 12.19 references Temporal.Instant. TypeScript 6.0 does not ship that namespace.
// Remove this file when the TypeScript lib includes Temporal.
declare namespace Temporal {
  interface Instant {
    toJSON(): string;
  }
}
