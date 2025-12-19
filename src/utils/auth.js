export const getUserType = () => {
  try {
    // Ưu tiên key 'role' (đã set plain string) → fallback 'userType' → object trong 'user'
    const directRole = localStorage.getItem('role');
    if (directRole) return String(directRole).toLowerCase();

    const userType = localStorage.getItem('userType');
    if (userType) return String(userType).toLowerCase();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed?.role) return String(parsed.role).toLowerCase();
      if (parsed?.userType) return String(parsed.userType).toLowerCase();
    }

    return null;
  } catch (e) {
    console.warn('Cannot read user from storage', e);
    return null;
  }
};
