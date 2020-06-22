const boom = require('boom')
const Sentry = require('@sentry/node')
const { config } = require('../../config')
const debug = require('debug')('app:error')

const isRequestAjaxOrApi = require('../../utils/isRequestAjaxOrApi')

Sentry.init({ dsn: `https://${config.sentryDns}@sentry.io/${config.sentryId}` });

const withErrorStack = (err, stack) => {
  if (config.dev) return { ...err, stack}
}

const logErrors = (err, req, res, next) => {
  Sentry.captureException(err)
  debug(err.stack)
  next(err)
}

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(boom.badImplementation(err))
  }

  next(err)
}

const clientErrorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload }
  } = err
  // catch errors for AJAX request or if an error ocurrs while stream
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack))
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  debug('errorHandler :: ', err.output)
  const {
    output: { statusCode, payload }
  } = err

  res.status(statusCode)
  res.render('error', withErrorStack(payload, err.stack))
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler
}