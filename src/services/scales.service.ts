import axio from "./api";
import type {
  ScaleDetailsResponse,
  ScaleRequest,
  ScaleResponse,
} from "../types/scale";

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

  listByMinistry: async (ministryId: number): Promise<ScaleResponse[]> => {
    const { data } = await axio.get<ScaleResponse[]>(
      `${MINISTRIES_PATH}/${ministryId}/scales`,
    );
    return data;
  },

  findById: async (
    ministryId: number,
    scaleId: number,
  ): Promise<ScaleDetailsResponse> => {
    const { data } = await axio.get<ScaleDetailsResponse>(
      `${MINISTRIES_PATH}/${ministryId}/scales/${scaleId}`,
    );
    return data;
  },
};
