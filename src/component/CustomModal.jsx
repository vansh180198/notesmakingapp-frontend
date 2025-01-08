const CustomModal = ({ open, onClose, children, message }) => {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div >
          {children}
          {message && <p className="text-green-500 text-center">{message}</p>}
        </div>
      </div>
    );
  };
  
  export default CustomModal;
  