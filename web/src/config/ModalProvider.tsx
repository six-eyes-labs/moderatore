"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface ModalContextType {
  modalType: string | null;
  openModal: (type: string) => void;
  closeModal: () => void;
}

export const ModalTypes = {
  Vote: "Vote",
  OpposeRule: "OpposeRule",
  ProposeRule: "ProposeRule",
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalType, setModalType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (type: string) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };
  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
