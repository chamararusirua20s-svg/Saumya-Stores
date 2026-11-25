import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");
  const [pendingAction, setPendingAction] = useState(null);

  const openAuthModal = (path = "/", action = null) => {
    setRedirectPath(path);
    setPendingAction(() => action);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  /**
   * Helper that checks if user is logged in.
   * If logged in: executes callback() immediately.
   * If guest: opens the login-required modal and remembers the intended path and action.
   */
  const requireAuth = (callback, path = "/") => {
    if (user) {
      if (typeof callback === "function") callback();
      return true;
    } else {
      openAuthModal(path, callback);
      return false;
    }
  };

  return (
    <AuthModalContext.Provider
      value={{
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        redirectPath,
        pendingAction,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
