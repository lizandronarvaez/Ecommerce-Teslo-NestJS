import * as bcrypt from 'bcrypt';
export const hashPassword = (password: string) => {
  const salt: number = 10;
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const comparePassword = (password: string, passwordHash: string) => {
  return bcrypt.compareSync(password, passwordHash);
};
