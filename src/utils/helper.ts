export const isStringified = (input: string = "") => {
  try {
    return JSON.parse(input);
  } catch {
    return input;
  }
};
