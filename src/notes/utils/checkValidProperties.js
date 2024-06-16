const VALID_PROPERTIES = [
  "name",
  "description",
  "important",
  "status",
  "dueDate"
];

const checkValidProperties = (noteContent) => {
  return Object.keys(noteContent).filter(
    (key) => !VALID_PROPERTIES.includes(key)
  ).length;
};

export default checkValidProperties;
