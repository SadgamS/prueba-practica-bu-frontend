export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString('base64');
};
