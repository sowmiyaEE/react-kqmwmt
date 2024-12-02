import React, { useRef, useState, createRef } from 'react';
import './style.css';
import Pagination from './pagination.js';
import DelDialog from './Deleter.js';
import Note from './note';
import { get, totalPages } from './queries.js';
import Popup from './Popup.js';
import Pinner from './Pinner.js';
const pinSort = (Arr) => {
  return Arr.sort((a, b) =>
    !a.isPinned && b.isPinned ? -1 : a.isPinned == b.isPinned ? 0 : 1
  );
};
export default function App({ pageDefault = 1 }) {
  const [page, setPage] = useState(1);
  const popup = useRef();
  const delDialogRef = useRef();
  const pageRef = useRef(pageDefault);
  const elRefs = useRef({});
  const [NotesArray, setNotesArray] = useState(pinSort(get(page)));
  let editingIndex = useRef(-1);
  const updatePage = (pageNo) => {
    pageRef.current.innerHTML = pageNo;
    setPage(pageNo);
    setNotesArray((ct) => {
      return ct.map((c) => {
        return {
          ...c,
          Id: c.Id + 6,
          heading: c.Id + 6 + c.heading + (c.Id + 6),
        };
      });
    });
  };
  const updatePinCallback = (noteId, pin) => {
    let n = NotesArray.find((i) => i.Id == noteId);
    n.isPinned = pin;
    setNotesArray(
      pinSort(NotesArray.map((note) => (note.Id == noteId ? n : note)))
    );
    elRefs.current['el' + noteId].current.update(n);
  };
  const handleClick = () => {
    const noteAdded = { Id: NotesArray.length + 1, date: new Date() };
    editingIndex = {
      index: NotesArray.length,
      note: noteAdded,
      Id: noteAdded.Id,
    };
    elRefs.current['el' + noteAdded.Id] = createRef();
    setNotesArray((NotesArray) => [noteAdded, ...NotesArray.slice(0, 5)]);

    if (!popup.current.isOpen()) {
      const note = {
        notes: noteAdded,
        ref: {
          update: (n) => {
            setNotesArray((NotesArray) =>
              NotesArray.map((note) => (note.Id == editingIndex.Id ? n : note))
            );
            elRefs.current['el' + editingIndex.Id].current.update(n);
          },
        },
        Delete: () => {},
      };
      popup.current.open(note);
      popup.current.focus();
    }
  };
  const handleOpen = (note, i) => {
    editingIndex = { index: i, note: note, Id: note.Id };
    if (!popup.current.isOpen()) {
      note = {
        notes: note,
        ref: {
          update: (n) => {
            setNotesArray((NotesArray) =>
              NotesArray.map((note) => (note.Id == editingIndex.Id ? n : note))
            );
            elRefs.current['el' + editingIndex.Id].current.update(n);
          },
        },
        Delete: () => {},
      };
      popup.current.open(note);
      popup.current.focus();
    }
  };
  for (var h = 0; h < NotesArray.length; h++) {
    elRefs.current['el' + NotesArray[h].Id] =
      elRefs.current['el' + NotesArray[h].Id] || createRef();
  }
  return (
    <div id="noteroot">
      <span ref={pageRef}></span>
      <header>
        <button type="button" onClick={handleClick}>
          New Note
        </button>{' '}
        <br />
        <br />
        <br />
      </header>
      <DelDialog ref={delDialogRef} />
      <Popup ref={popup} open={false} />
      <div className="mainBox">
        {NotesArray.map((i, index) => (
          <div
            key={'e' + index}
            style={{ gridArea: 'el' + (index + 1), background: 'white' }}
            onClick={() => {
              handleOpen(NotesArray[index], index);
            }}
          >
            {' '}
            <Pinner
              isPinned={i.isPinned}
              updatePin={(pinState) => {
                updatePinCallback(NotesArray[index].Id, pinState);
              }}
            />
            <Note
              deleteDialogRef={(e) => {
                delDialogRef.current.callDelete(i.Id);
                e.stopPropagation();
              }}
              noteDetail={NotesArray[index]}
              ref={elRefs.current['el' + NotesArray[index].Id]}
            />
          </div>
        ))}
      </div>
      <Pagination
        totalPages={totalPages}
        pageNo={pageDefault}
        updatePageCallback={updatePage}
      />
    </div>
  );
}
