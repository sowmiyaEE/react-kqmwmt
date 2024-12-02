let batched = [],
  updateQueries = [];

const queries = {
  create: async (args) => {
    Page(create(args));
  },
  read: async (...args) => {
    Page(read(args[0], args[1]));
  },
  Delete: async (args) => {
    Page(Delete(args));
  },
  update: (args) => {
    batched.find((a) => a.Id == args.Id)
      ? batched.map((a) => (a.Id == args.Id ? args : a))
      : batched.push(args);
    updateQueries = batched.map((b) => update(b));
  },
  clear: () => {
    Page(updateQueries);
    (batched = []), (updateQueries = []);
  },
  getTotalRecords: async () => {
    Page({ stmt: 'select count(*) from notes;' });
  },
};

const create = (noteDetail) => {
  return {
    stmt: 'INSERT INTO notes (  heading,  tagline, detail,  isPinned,  date) VALUES (:heading ,:tagline, :detail,:date);',
    args: {
      heading: noteDetail.heading,
      tagline: noteDetail.tagline,
      isPinned: noteDetail.isPinned,
      date: noteDetail.date,
    },
  };
};
const read = (limit, offset) => {
  return {
    stmt: 'select * from notes limit / offset ?l',
    args: [
      { type: 'INTEGER', value: limit },
      { type: 'INTEGER', value: offset },
    ],
  };
};
const update = (noteDetail) => {
  return {
    stmt: '  UPDATE notes SET heading = :heading, tagline = :tagline, detail = :detail, isPinned = :isPinned, date = :date where Id = :Id;',
    args: {
      heading: noteDetail.heading,
      tagline: noteDetail.tagline,
      isPinned: noteDetail.isPinned,
      date: noteDetail.date,
    },
  };
};

const Delete = (Id) => {
  return {
    stmt: 'DELETE FROM noted where Id = :Id',
    args: { Id: Id },
  };
};
let url =
  'https://gigs-interview-sowmiyaee.aws-us-east-1.turso.io/v2/pipeline/';
let url2 =
  'libsql://gigs-interview-sowmiyaee.aws-us-east-1.turso.io/v2/pipeline';
let authtoken2 =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzI4NjI3MjgsImlkIjoiNmU0MDBiZWMtZmIwNi00NzVkLTk5NGUtNDRiYjNiYzFjMjc4In0.bzL_CO5a_-mrLm-tnNTWt9k20K_rXnNIzJFwe_MhSAF7DAvu-kP50kzIH2VadbZq5UicFCHVAcwg9FMOhBJvBw';
let authToken =
  'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJnaWQiOiJhM2FkNWJmZi1iZjNiLTQ2M2QtOTIyNS0xMzQxZmQyYjUxN2MiLCJpYXQiOjE3MzI4NjI2NDB9.IoWHpvEaruX15A6WElSFxw2d4Mz3Jat2GwqagciGLjt5LQxpB4zeygIwLJfoRNeDL5cUeJGnQhtU0EGuWWTtBA';
//import { createClient } from '@libsql/client/web';
const noteDetail = {
  Id: 1,
  heading: 'pin my dairy pinned',
  tagline: 'this is important',
  isPinned: true,
  detail:
    'lines of data\ndklgjsgn sdgssgdmsgkl msg hifs gdjkdl sgdjglks ggj lkdjg gjj jkdjg l sgd gljg jg gjgoi jgs fjdjfh  fkjdhk jhkfd hdjhk d;  khfj dh khd hjkf hdjh df h fjhk d hf hdkfjh df hdf hdj;h',
  date: new Date(),
};
let bulk = [];
for (var i = 0; i < 100; i++) {
  bulk.push({
    ...noteDetail,
    heading: i + 1 + 'head' + (i + 1),
    Id: i + 1,
  });
}
export const get = (pageNumber) => {
  return bulk.slice((pageNumber - 1) * 6, (pageNumber - 1) * 6 + 6);
};
export var totalPages = queries.getTotalRecords().pages / 6;

export async function Page(STATEMENT) {
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authtoken2}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods':
          'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      },
      data: JSON.stringify({
        requests: [{ type: 'execute', stmt: 'select * from notes;' }],
      }),
      //body: JSON.stringify({statements: [{q:"", params: []}]})
      mode: 'cors',
    });
    console.log(r);
    if (r.ok) {
      const t = await r.json();
    } else {
      return [];
    }
  } catch (err) {
    console.log('err', err.message);
    return false;
  }
}
export default { ...queries };
