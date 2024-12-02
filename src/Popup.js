import './style.css';
import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import { useOnClickOutside } from './hooks.js';
import Pinner from './Pinner.js';

const styles = {
  popupContent: {
    tooltip: {
      position: 'absolute',
      zIndex: 999,
    },
    modal: {
      position: 'relative',
      margin: 'auto',
      padding: '3%',
      height: '500px',
      width: '60%',
      justifyContent: 'center',
      border: '1px dotted sandybrown',
    },
  },
  popupArrow: {
    height: '8px',
    width: '16px',
    position: 'absolute',
    background: 'transparent',
    color: '#FFF',
    zIndex: -1,
  },
  overlay: {
    tooltip: {
      position: 'fixed',
      top: '10%',
      bottom: '10%',
      left: '10%',
      right: '10%',
      zIndex: 999,
    },
    modal: {
      position: 'fixed',
      top: '10%',
      bottom: '0',
      left: '0',
      right: '0',
      display: 'flex',
      zIndex: 999,
    },
  },
};
const getRootPopup = () => {
  let PopupRoot = document.getElementById('popup-root');
  if (PopupRoot === null) {
    PopupRoot = document.createElement('div', { id: 'popup-root' });
    PopupRoot.setAttribute('id', 'popup-root');
    document.body.appendChild(PopupRoot);
  }
  return document.getElementById('popup-root');
};
export const Popup = forwardRef(({ open = true, notes }, ref) => {
  const [note, setNote] = useState(notes);
  const [isOpen, setIsOpen] = useState(open);
  const focusedElBeforeOpen = useRef();
  const contentRef = useRef();
  const openPopup = () => {
    if (isOpen) return;
    setIsOpen(true);
  };

  const closePopup = () => {
    if (!isOpen) return;
    setIsOpen(false);
    focusedElBeforeOpen.current?.focus();
  };

  const togglePopup = () => {
    event?.stopPropagation();
    if (!isOpen) openPopup(event);
    else closePopup(event);
  };
  const focusContentOnOpen = () => {
    /*const focusableEls = contentRef?.current?.querySelectorAll(
      'h2, p, a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
    );
    const firstEl = Array.prototype.slice.call(focusableEls)[0];
    firstEl?.focus();*/
  };
  useImperativeHandle(ref, () => ({
    open: (note) => {
      openPopup();
      setNote(note);
    },
    close: () => {
      closePopup();
    },
    toggle: () => {
      togglePopup();
    },
    focus: () => {
      focusContentOnOpen();
    },
    isOpen: () => {
      return isOpen;
    },
  }));
  useOnClickOutside([contentRef], closePopup);
  const addWarper = () => {
    return {
      style: {
        ...styles.popupContent.modal,
        pointerEvents: 'auto',
        background: 'white',
      },
      ref: contentRef,
      onClick: (e) => {
        e.stopPropagation();
      },
    };
  };
  const renderContent = () => {
    return (
      <div {...addWarper()} key="C" role={'dialog'} id="Popup">
        <Popcontent
          purpose={note ? note.ref.update : ''}
          deletepopup={note ? note.Delete : ''}
          hidepopup={closePopup}
          noteDetails={note ? note.notes : {}}
        />
      </div>
    );
  };
  const ovStyle = styles.overlay.modal;
  const content = [
    <div
      key="O"
      data-testid="overlay"
      data-popup={'modal'}
      style={{
        ...ovStyle,
        pointerEvents: 'auto',
      }}
      tabIndex={-1}
    >
      {renderContent()}
    </div>,
  ];

  return <>{isOpen && ReactDOM.createPortal(content, getRootPopup())}</>;
});
export default Popup;

export function Popcontent({
  purpose,
  noteDetails,
  hidepopup,
  deletepopup,
}) {
  const notehead = useRef(),
    notetagline = useRef(),
    notedetail = useRef(),
    noteid = useRef(),
    notedate = useRef();

  const onKeyPressed = (event) => {
    if (event.keyCode == 13) {
      const id = event.target.id;
      let nextEl, child;
      switch (id) {
        case 'notehead': {
          nextEl = 'notetagline';
          child = 1;
          break;
        }
        case 'notetagline': {
          nextEl = 'notedetail';
          child = 1;
          break;
        }
        default: {
        }
      }
      if (nextEl) {
        var el = document.getElementById(nextEl);
        var range = document.createRange();
        var sel = window.getSelection();
        console.log(el.childNodes);

        range.setStart(el.childNodes[child], 0);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    purpose({
      heading: notehead.current.innerHTML,
      tagline: notetagline.current.innerHTML,
      detail: notedetail.current.innerHTML,
      isPinned: noteDetails.isPinned,
      Id: noteDetails.Id,
    });
    updateDate();
  };
  const pin = (state) => {
    noteDetails.isPinned = state;
    updateDate();
    purpose({
      heading: notehead.current.innerHTML,
      tagline: notetagline.current.innerHTML,
      detail: notedetail.current.innerHTML,
      isPinned: state,
      Id: noteDetails.Id,
    });
  };
  const updateDate = () => {
    notedate.current.innerHTML = `Last updated `;
    noteDetails.lastUpdated = '';
  };
  const Delete = () => {
    clearNote();
    deletepopup();
  };
  const hide = () => {
    clearNote();
    hidepopup();
  };
  const clearNote = () => {
    notehead.current.innerHTML = '';
    notetagline.current.innerHTML = '';
    notedetail.current.innerHTML = '';
    notedate.current.innerHTML = '';
  };

  return (
    <div className="">
      <div>
      <label ref={notedate} className="notedate">
        {noteDetails.heading
          ? `Note Last updated ${noteDetails.lastUpdated}`
          : `New Note ${new Date()}`}
      </label>
      <Pinner isPinned={noteDetails.isPinned} updatePin={(pinState)=>{pin(pinState)}}/>
      </div>
      <br />
      <div
        // style={{fontSize: 2rem; line-height: 1.4; max-width:60rem;margin : 0 auto ; padding : 4rem;}}
        ref={noteid}
        spellcheck="false"
      >
        <code />
        <h2>
          <p
            id="notehead"
            onFocus={() => {}}
            onKeyDown={(e) => {
              onKeyPressed(e);
            }}
            contentEditable
          >
            <pre>
              <p ref={notehead}> {noteDetails.heading || `new note`} </p>
            </pre>
          </p>
        </h2>

        <div
          id="notetagline"
          onKeyDown={(e) => {
            onKeyPressed(e);
          }}
          contentEditable
        >
          <code />
          <pre>
            <p ref={notetagline} className="align">
              {noteDetails.tagline || `tagline`}
            </p>
          </pre>
        </div>
        <br />
        <div
          id="notedetail"
          style={{ height: 200 + 'px' }}
          onInput={(e) => {
            onKeyPressed(e);
          }}
          contentEditable
        >
          <code />
          <pre>
            <p ref={notedetail} className="">
              {noteDetails.detail || ` Add note here`}
            </p>
          </pre>
        </div>
      </div>
    </div>
  );
}
