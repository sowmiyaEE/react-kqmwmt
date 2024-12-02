import React, { useState } from 'react';
import './style.css';

export default function Pagination({
  totalPages = 5,
  updatePageCallback,
  pageNo,
}) {
  const [page, setPage] = useState(pageNo);
  const updatePage = (i) => {
    updatePageCallback(i);
    setPage(i);
  };
  const range = (a, b) => {
    let arr = [];
    for (let i = a; i < b; i++) arr.push(i);
    return arr;
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          top: 55 + '%',
          left: 30 + '%',
          width: 500 + 'px',
        }}
      >
        {totalPages > 2 ? (
          <button
            onClick={() => {
              page > 2 ? updatePage(page - 1) : '';
            }}
            className={page > 2 ? 'abled' : 'disabled'}
          >
            Previous
          </button>
        ) : (
          <div> </div>
        )}
        <button
          onClick={() => {
            page != 1 ? updatePage(1) && updatePageCallback(page) : '';
          }}
          className={page != 1 ? 'abled' : 'disabled focussed'}
        >
          <img src="home.jpeg" altText="Home" />
        </button>
        {page != 1 && page != totalPages && totalPages > 2 ? (
          <label style={{ width: 20 + 'px' }}>{page}</label>
        ) : (
          ''
        )}
        {totalPages != 1 ? (
          <button
            onClick={() => {
              page != totalPages ? updatePage(totalPages) : '';
            }}
            className={page != totalPages ? 'abled' : 'disabled'}
          >
            {' '}
            <label> {totalPages} </label>{' '}
          </button>
        ) : (
          ''
        )}
        {totalPages > 2 ? (
          <button
            onClick={() => {
              page < totalPages - 1 ? updatePage(page + 1) : '';
            }}
            className={page < totalPages - 1 ? 'abled' : 'disabled'}
          >
            Next
          </button>
        ) : (
          <div> </div>
        )}
      </div>
    </>
  );
}
