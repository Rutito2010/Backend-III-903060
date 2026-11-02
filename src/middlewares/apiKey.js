import AppError, { ErrorDictionary } from '../utils/errors.js';
import config from '../config/index.js';

// docs y health se montan antes: este middleware no los ve
const apiKey = (req, res, next) => {
  const key = req.get('x-api-key');

  if (!key) {
    return next(new AppError(ErrorDictionary.API_KEY_MISSING));
  }

  if (key !== config.apiKey) {
    return next(new AppError(ErrorDictionary.API_KEY_INVALID));
  }

  next();
};

export default apiKey;
