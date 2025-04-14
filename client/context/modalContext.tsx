import React, { createContext, useContext, useState, ReactNode } from 'react';
export type ModalType = 'taskDetails' | 'addTask' | 'shareTaskList' | 'assignMembers' | 'deleteList' | 'leaveList' | null; // defining the types of modals in the application

interface ModalContextType { // context type
  activeModal: ModalType;
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => { // custom hook to use the modal context
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps { // props for the modal provider
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = (modalType: ModalType) => {

    if (activeModal !== null) { // if a modal is already open, close it first
      setActiveModal(null);
    }
    setActiveModal(modalType); // then open the new modal
  };

  const closeModal = () => {
    setActiveModal(null); // close the modal
  };

  return ( // return the provider
    <ModalContext.Provider value={{ activeModal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalContext;