import { METRIC_UNIT } from "../enums/tracking.enum";

export const SYSTEM_ERROR_CODE = {
  METRIC_TRACKING: {
    UNIT_BAD_REQUEST: `unit must be one of the following values: ${Object.values(METRIC_UNIT).toString()}`,
  },

};

