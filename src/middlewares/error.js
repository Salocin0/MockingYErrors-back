import EErrors from '../services/errors/enums.js';

export default (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.SERVER_ERROR:
      res.status(500).send({ status: 'error', error: error.name, cause: error.cause });
      break;
    case EErrors.INVALID_INPUT_ERROR:
      res.status(400).send({ status: 'error', error: error.name, cause: error.cause });
      break;
    case EErrors.UPDATE_ERROR:
      res.status(401).send({ status: 'error', error: error.name, cause: error.cause });
      break;
    case EErrors.DELETE_ERROR:
      res.status(401).send({ status: 'error', error: error.name, cause: error.cause });
      break;
    case EErrors.MONGO_CONNECTION_ERROR:
      res.status(500).send({ status: 'error', error: error.name, cause: error.cause });
      break;
    default:
      res.status(500).send({ status: 'error', error: 'Unhandled error' });
      break;
  }
};
