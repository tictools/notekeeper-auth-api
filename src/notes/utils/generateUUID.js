import { randomUUID } from "node:crypto";

function generateUUID() {
  const uuid = randomUUID();

  return uuid;
}

export default generateUUID;
