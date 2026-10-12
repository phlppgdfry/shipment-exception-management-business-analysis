// Links from the demo back to the case documentation (the source of truth) on GitHub.
export const REPO = "https://github.com/phlppgdfry/shipment-exception-management-business-analysis";
export const doc = (path: string) => `${REPO}/blob/main/${path}`;
export const SITE = "https://phlppgdfry.github.io/shipment-exception-management-business-analysis/";
export const withBase = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const DOCS = {
  rules: doc("docs/05-requirements/exception-rules.md"),
  requirements: doc("docs/05-requirements/requirements.md"),
  stories: doc("docs/06-backlog/user-stories.md"),
  feature: doc("docs/06-backlog/features/exception-decision.feature"),
  traceability: doc("docs/05-requirements/traceability.md"),
  toBe: doc("docs/04-process/to-be.md"),
  uml: doc("docs/04-process/uml.md"),
  architecture: doc("docs/12-architecture/README.md"),
  api: doc("demo/mock-apis/openapi.yaml"),
  prioritisation: doc("docs/06-backlog/prioritisation.md"),
  sprintPlan: doc("docs/08-delivery/sprint-plan.md"),
  batLog: doc("docs/09-acceptance/bat-log.md"),
  readiness: doc("docs/10-go-live/release-readiness.md"),
  kpiTree: doc("docs/01-opportunity/kpi-tree.md"),
  decisions: doc("docs/03-workshops/decision-log.md"),
  ux: doc("docs/07-design/ux-specification.md"),
  testStrategy: doc("docs/09-acceptance/test-strategy.md"),
  demoReadme: doc("demo/README.md"),
};
