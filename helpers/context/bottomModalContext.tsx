import React, { createContext, useState, useContext, ReactNode } from "react";

interface BottomModalContextType {
  isVisible: boolean;
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
  modalContent: ReactNode | null;
}

const BottomModalContext = createContext<BottomModalContextType | undefined>(
  undefined
);

export const BottomModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = (content: ReactNode) => {
    setModalContent(content);
    setIsVisible(true);
  };
  const hideModal = () => setIsVisible(false);

  return (
    <BottomModalContext.Provider
      value={{
        isVisible,
        showModal,
        hideModal,
        modalContent,
      }}
    >
      {children}
    </BottomModalContext.Provider>
  );
};

export const useBottomModal = (): BottomModalContextType => {
  const context = useContext(BottomModalContext);
  if (context === undefined) {
    throw new Error("useBottomModal must be used within a BottomModalProvider");
  }
  return context;
};
