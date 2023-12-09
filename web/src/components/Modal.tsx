import React from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-opacity-20 bg-black">
      <div className="relative w-auto max-w-3xl min-w-[300px] md:min-w-[400px] mx-auto my-6">
        <div className="relative bg-white border w-full p-8 px-4 rounded-lg shadow-lg">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 text-accent hover:text-gray-700"
          >
            Close
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
