import { v4 as uuid } from 'uuid';

export const editFileName = (req, file, callback) => {
  const extName = file.originalname.split('.')[1];
  const editFileName = `${uuid()}.${extName}`;
  // const randomName = Array(4)
  //   .fill(null)
  //   .map(() => Math.round(Math.random() * 100).toString(16))
  //   .join('');
  callback(null, editFileName);
};
