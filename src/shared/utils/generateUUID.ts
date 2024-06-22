import { randomUUID } from "node:crypto";
import { UUID } from "src/users/types";

function generateUUID(): UUID {
  const uuid = randomUUID();

  return uuid;
}

export default generateUUID;
