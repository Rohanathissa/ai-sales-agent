// Maps common PostgreSQL error codes to sensible HTTP status codes.
// Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
function mapPgErrorToStatus(err) {
  switch (err.code) {
    case '23505': // unique_violation
      return 409;
    case '23503': // foreign_key_violation
      return 409;
    case '23502': // not_null_violation
      return 400;
    case '22P02': // invalid_text_representation (bad UUID/int, bad JSON, etc.)
      return 400;
    default:
      return null;
  }
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express recognizes error middleware by its 4-argument signature.
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  const pgStatus = mapPgErrorToStatus(err);
  const status = err.status || pgStatus || 500;

  res.status(status).json({
    error: err.publicMessage || err.message || 'Internal server error',
  });
}

module.exports = { notFoundHandler, errorHandler };
