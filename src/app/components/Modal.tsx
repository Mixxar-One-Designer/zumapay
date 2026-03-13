import React from "react";

interface Props {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<Props> = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-darkbg rounded-xl p-6 w-11/12 max-w-md">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div>{children}</div>
        <button
          className="mt-4 bg-primary text-darkbg rounded-lg w-full py-2"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;