const CustomModal = ({ open, onClose, children, message }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-lg space-y-4">
          {children}
          {message && <p className="text-green-500 text-center">{message}</p>}
        </div>
      </div>
    );
  };
  
  export default CustomModal;
  