export const getFriendlyFirebaseError = (errorCode: string) => {
    switch (errorCode) {
        case "auth/invalid-email":
            return "Oops! The email address you entered doesn't look right.";
        case "auth/user-not-found":
            return "We couldn't find an account with this email.";
        case "auth/wrong-password":
            return "The password you entered is incorrect. Try again!";
        case "auth/email-already-in-use":
            return "This email is already registered. Try logging in instead.";
        case "auth/weak-password":
            return "Your password is too weak. Please choose a stronger one.";
        case "auth/network-request-failed":
            return "Network error! Please check your internet connection.";
        default:
            return "Something went wrong. Please try again.";
    }
};
