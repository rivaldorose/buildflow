import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6943e7929019e63f9138e81d", 
  requiresAuth: true // Ensure authentication is required for all operations
});
