export const rateLimits = {
  free: {
    requests: 100,
    duration: 60 * 1000 // 1 minute
  },
  basic: {
    requests: 500,
    duration: 60 * 1000 // 1 minute
  },
  premium: {
    requests: 1000,
    duration: 60 * 1000 // 1 minute
  }
};