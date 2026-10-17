export const loadJournal = () => import("./Blogs");

// Warm the small route chunk when the visitor shows intent, not on every load.
export const warmJournal = () => {
  void loadJournal().catch(() => {});
};
