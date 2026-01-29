/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as functions_chatbot from "../functions/chatbot.js";
import type * as functions_organizations from "../functions/organizations.js";
import type * as functions_payments from "../functions/payments.js";
import type * as functions_tasks from "../functions/tasks.js";
import type * as functions_users from "../functions/users.js";
import type * as functions_verification from "../functions/verification.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "functions/chatbot": typeof functions_chatbot;
  "functions/organizations": typeof functions_organizations;
  "functions/payments": typeof functions_payments;
  "functions/tasks": typeof functions_tasks;
  "functions/users": typeof functions_users;
  "functions/verification": typeof functions_verification;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
