import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { useOnClickOutside } from './hooks.js';

export const DelDialog = forwardRef(({ noteId }, ref) => {
  const contentRef = useRef();
  const getRootPopup = () => {
    let PopupRoot = document.getElementById('popup-delete');
    if (PopupRoot === null) {
      PopupRoot = document.createElement('div', { id: 'popup-delete' });
      PopupRoot.setAttribute('id', 'popup-delete');
      document.body.appendChild(PopupRoot);
    }
    return document.getElementById('popup-delete');
  };
  const [open, isOpen] = useState(false);
  const callDelete = (noteId) => {
    console.log('am being called');
    isOpen(true);
  };

  useImperativeHandle(ref, () => ({
    callDelete: (Id) => {
      callDelete();
    },
  }));
  const deleteN = (value) => {
    isOpen(false);
  };

  useOnClickOutside([contentRef], deleteN);

  const content = (
    <div
      style={{
        position: 'fixed',
        top: 100 + 'px',
        left: '40',
        height: '100px',
        width: '150px',
        background: 'white',
        padding: '20px',
        zIndex: 9999,
        margin: 'auto',
        justifyContent: 'center',
        border: '1px dotted sandybrown',
        pointerEvents: 'auto',
      }}
    >
      Are you sure you want to delete?
      <div style={{ display: 'flex' }} ref={contentRef}>
        <button
          onClick={() => {
            deleteN({ noteId });
          }}
        >
          ok
        </button>
        <button
          onClick={() => {
            deleteN();
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );

  return <>{open && ReactDOM.createPortal(content, getRootPopup())}</>;
});
export default DelDialog;
