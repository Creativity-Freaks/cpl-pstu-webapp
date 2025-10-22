// Admin identification strategy for mock/demo environment.
// In production, replace with a backend check (JWT claims/roles).

export const ADMIN_EMAILS: string[] = [
  "admin@pstu.ac.bd",
  "cpl.admin@pstu.ac.bd",
];

export const isAdminEmail = (email: string) => {
  const lower = email.trim().toLowerCase();
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(lower);
};
