const mockGenerateUUID = jest.fn(() => {
  const mockUUID = "mock_b06-9edf-4af8-9c3c-34ab95a098bf";

  return mockUUID;
});

export const utils = {
  generateUUID: mockGenerateUUID,
};
