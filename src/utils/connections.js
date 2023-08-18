import { connect } from 'mongoose';
import EErrors from '../services/errors/enums.js';
import CustomError from '../services/errors/custom-error.js';

export async function connectMongo() {
  try {
    await connect('mongodb+srv://Salocin0:bQJ5b9byQb6PlLWM@coder.qmxekir.mongodb.net/?retryWrites=true&w=majority');
    console.log('plug to mongo!');
  } catch (e) {
    CustomError.createError({
      name: 'Error De Conexion a Base De Datos', 
      cause: 'No se pudo establecer una conexión con la base de datos de MongoDB.',
      message: 'Ocurrió un error al intentar conectarse a la base de datos.',
      code: EErrors.MONGO_CONNECTION_ERROR,
    });
  }
}
