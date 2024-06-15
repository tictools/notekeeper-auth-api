const toDTO = ({ _id, created_at, due_date, ...restOfNote }) => ({
  id: _id,
  createdAt: created_at,
  dueDate: due_date,
  ...restOfNote
});

const noteMapper = {
  toDTO
};

export default noteMapper;
