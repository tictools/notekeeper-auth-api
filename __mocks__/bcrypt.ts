const hash = jest.fn(() => Promise.resolve("hashed-password"));

const compare = jest.fn((password, hash) => Promise.resolve(password === hash));

export default { hash, compare };
