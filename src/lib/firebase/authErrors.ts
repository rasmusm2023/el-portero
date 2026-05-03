/**
 * Human-readable Firebase Auth errors for the admin login form.
 */
export function firebaseAuthErrorMessage(code: string | undefined): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn’t look valid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Wrong email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Try again in a few minutes.";
    case "auth/network-request-failed":
      return "Network error — check your connection.";
    default:
      return "Could not sign in. Check your email and password.";
  }
}
