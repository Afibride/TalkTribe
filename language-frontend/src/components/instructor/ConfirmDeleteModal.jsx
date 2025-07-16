import React from 'react';
import '../../css/ConfirmDeleteModal.css';

const ConfirmDeleteModal = ({ 
  itemType, 
  itemName, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="confirm-delete-modal">
      <div className="modal-content">
        <h3>Delete {itemType}</h3>
        <p>
          Are you sure you want to delete this {itemType.toLowerCase()} "<strong>{itemName}</strong>"? 
          This action cannot be undone.
        </p>
        
        <div className="modal-actions">
          <button 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button 
            className="delete-btn"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
