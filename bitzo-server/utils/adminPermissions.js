const ROLE_PERMISSIONS = {
  admin: [
    "users:read",
    "users:write",
    "users:delete",
    "finance:read",
    "finance:write",
    "support:read",
    "support:write",
    "settings:write",
  ],
  finance: [
    "finance:read",
    "finance:write",
    "users:read",          // usually needed
  ],
  support: [
    "support:read",
    "support:write",
    "users:read",
  ],
  "read-only": [
    "users:read",
    "finance:read",
    "support:read",
  ],
};

exports.hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

exports.ROLE_PERMISSIONS = ROLE_PERMISSIONS;