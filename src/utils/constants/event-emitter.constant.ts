export const EVENT_EMITTER_LISTEN = {
  AUTH_MODULE: {
    SAVE_OR_UPDATE_TOKEN_WCT: 'auth.saveOrUpdateTokenWCT',
    LOGOUT_WCT: 'auth.logoutWCT',
  },
  LOGGER_MODULE: {
    LOG: 'logger.log',
    ERROR: 'logger.error',
    WARN: 'logger.warn',
    SEND_LOG_ERROR_TO_TEAMS: 'logger.send-log-error-to-teams',
  },
};

export const COUNT_MAX_LISTENERS = 50;
