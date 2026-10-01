export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, text: 'Empty', color: 'bg-slate-200' };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, text: 'Weak', color: 'bg-rose-500' };
  if (score <= 4) return { score, text: 'Medium', color: 'bg-amber-500' };
  return { score, text: 'Strong', color: 'bg-emerald-500' };
};
