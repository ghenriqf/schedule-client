import axio from "./api";
import type { ScaleRequest, ScaleResponse } from "../types/scale";

const MINISTRIES_PATH = "ministries";

export const scalesService = {
  create: async (
    ministryId: number,
    scale: ScaleRequest,
  ): Promise<ScaleResponse> => {
    const { data } = await axio.post<ScaleResponse>(
      `${MINISTRIES_PATH}/${ministryId}/scales`,
      scale,
    );

    return data;
  },
};
