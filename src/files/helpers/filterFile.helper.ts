// Filtrar el tipo de archivos
export const filterFile = (req, file, callback) => {
  if (!file) {
    return callback(new Error('No existe ningun archivo para subir'), false);
  }
  //   Extraemos el tipo de archivo
  const mymeType = file.mimetype.split('/').slice(-1).toString();
  //   creamos un array de archivos válidos
  const extensionsValid = ['jpeg', 'jpg', 'png'];
  //  realizamos la condicion para evaluarlo
  if (extensionsValid.includes(mymeType)) {
    return callback(null, true);
  }
  callback(null, false);
};
