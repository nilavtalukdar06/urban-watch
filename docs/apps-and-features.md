# Apps and Features

This file maps product features to concrete app routes and module files.

## `apps/web` (Citizen App)

Primary purpose: citizens submit reports, verify identity, donate to organizations, and use assistant/chat tools.

## Route Surfaces

- Dashboard shell: `apps/web/app/(dashboard)/layout.tsx`
- Home: `apps/web/app/(dashboard)/page.tsx`
- Reports list: `apps/web/app/(dashboard)/reports/page.tsx`
- Report details: `apps/web/app/(dashboard)/reports/[reportId]/page.tsx`
- Submit report: `apps/web/app/(dashboard)/submit-report/page.tsx`
- Donate: `apps/web/app/(dashboard)/donate/page.tsx`
- Verify account: `apps/web/app/(dashboard)/verify-account/page.tsx`
- Chatbot: `apps/web/app/(dashboard)/chatbot/page.tsx`
- Chat (Stream): `apps/web/app/(dashboard)/chat/page.tsx`

## Web Feature Map

- Identity and profile onboarding
  - UI/form: `apps/web/modules/profile/components/onboarding-form.tsx`
  - server action: `apps/web/modules/profile/functions/create-user.ts`
- Account verification workflow
  - upload and trigger: `apps/web/modules/profile/views/upload-file.tsx`
  - server action: `apps/web/modules/profile/functions/verify-account.ts`
  - status UI: `apps/web/modules/profile/components/verification.tsx`
- Report submission and history
  - form UI: `apps/web/modules/reports/components/submit-report.tsx`
  - submit action: `apps/web/modules/reports/functions/submit-report.ts`
  - listing UI: `apps/web/modules/reports/views/grid-view.tsx`
  - delete action/UI: `apps/web/modules/reports/components/delete-report.tsx`
- Donations
  - org cards/list: `apps/web/modules/donations/components/organization-card.tsx`, `apps/web/modules/donations/views/grid-view.tsx`
  - checkout API: `apps/web/app/api/payments/create/route.ts`
  - Stripe webhook API: `apps/web/app/api/stripe/webhook/route.ts`
- AI chatbot
  - API route: `apps/web/app/api/chat/route.ts`
  - UI container/input: `apps/web/modules/chatbot/views/message-container.tsx`, `apps/web/modules/chatbot/components/prompt-input.tsx`
  - history deletion: `apps/web/modules/chatbot/components/delete-messages.tsx`
- Inngest endpoint registration
  - `apps/web/app/api/inngest/route.ts`

## `apps/admin` (Organization App)

Primary purpose: organizations onboard, review and take reports, manage users/tasks, enable payments, and send operational emails.

## Route Surfaces

- Dashboard gate and shell: `apps/admin/app/(dashboard)/layout.tsx`
- Home: `apps/admin/app/(dashboard)/page.tsx`
- Reports inbox: `apps/admin/app/(dashboard)/reports/page.tsx`
- Report details: `apps/admin/app/(dashboard)/reports/[reportId]/page.tsx`
- My reports: `apps/admin/app/(dashboard)/my-reports/page.tsx`
- My report details: `apps/admin/app/(dashboard)/my-reports/[reportId]/page.tsx`
- Users: `apps/admin/app/(dashboard)/users/page.tsx`
- My tasks: `apps/admin/app/(dashboard)/my-tasks/page.tsx`
- Payments: `apps/admin/app/(dashboard)/payments/page.tsx`
- Org onboarding: `apps/admin/app/onboarding/page.tsx`

## Admin Feature Map

- Organization onboarding and profile
  - page: `apps/admin/app/onboarding/page.tsx`
  - form: `apps/admin/modules/profile/components/onboarding-form.tsx`
  - metadata update: `apps/admin/modules/profile/functions/update-metadata.ts`
- Report intake and assignment
  - unassigned report grid: `apps/admin/modules/reports/views/grid-view.tsx`
  - taken report grid: `apps/admin/modules/reports/views/my-reports-grid-view.tsx`
  - status updates: `apps/admin/modules/reports/components/report-status-updater.tsx`
  - trigger resolution email: `apps/admin/modules/reports/functions/send-resolution-email.ts`
  - semantic relevant report search: `apps/admin/modules/reports/functions/search-relevant-reports.ts`
  - UI component: `apps/admin/modules/reports/components/relevant-reports.tsx`
- Users management
  - table: `apps/admin/modules/users/views/table-view.tsx`
  - delete users: `apps/admin/modules/users/components/delete-users.tsx`
  - send message flow: `apps/admin/modules/users/components/send-email.tsx`
  - event trigger: `apps/admin/modules/users/functions/trigger-email.ts`
  - exports: `apps/admin/modules/users/functions/export-user.ts`, `apps/admin/modules/users/functions/export-all.ts`
- Task management
  - kanban: `apps/admin/modules/tasks/views/kanban-view.tsx`
  - calendar: `apps/admin/modules/tasks/views/calendar-view.tsx`
  - create task: `apps/admin/modules/tasks/components/create-task.tsx`
  - task card and toolbar: `apps/admin/modules/tasks/components/event-card.tsx`, `apps/admin/modules/tasks/components/toolbar.tsx`
  - org member loader: `apps/admin/modules/tasks/functions/get-members.ts`
- Payments and BYOS keys
  - UI: `apps/admin/modules/payments/views/table-view.tsx`, `apps/admin/modules/payments/components/enable-payments.tsx`, `apps/admin/modules/payments/components/delete-keys.tsx`, `apps/admin/modules/payments/components/copy-webhook-url.tsx`
  - secrets create/delete APIs: `apps/admin/app/api/secrets/create/route.ts`, `apps/admin/app/api/secrets/delete/route.ts`
- Inngest endpoint registration
  - `apps/admin/app/api/inngest/route.ts`

## Shared UX/Infra Patterns Across Both Apps

- Clerk auth wrappers + auth views in `modules/auth/*`
- Convex client provider in `components/convex-client-provider.tsx`
- Shared UI primitives from `@workspace/ui`
