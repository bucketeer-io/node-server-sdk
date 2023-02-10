export type User = {
  id: string;
  data: { [key: string]: string };
};

export function createUser(id: string, data: { [key: string]: string }): User {
  return {
    id,
    data,
  };
}
