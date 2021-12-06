export type Host = string;
export type Token = string;
export type Tag = string;
export type UserEvaluationsId = string;

// We want to use @types/node, but syntax references in ES5 will cause errors.
// @ts-ignore
export const GIT_REVISION: string = process.env.GIT_REVISION;
