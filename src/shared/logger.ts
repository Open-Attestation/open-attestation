import debug from "debug";

const logger = debug("open-attestation");

interface Logger {
  trace: debug.Debugger;
  debug: debug.Debugger;
  info: debug.Debugger;
  warn: debug.Debugger;
  error: debug.Debugger;
}

export const getLogger = (namespace: string): Logger => ({
  trace: logger.extend(`trace:${namespace}`),
  debug: logger.extend(`debug:${namespace}`),
  info: logger.extend(`info:${namespace}`),
  warn: logger.extend(`warn:${namespace}`),
  error: logger.extend(`error:${namespace}`),
});
