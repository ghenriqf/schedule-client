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

  addMusic: async (ministryId: number, scaleId: number, musicId: number) => {
    const { data } = await axio.post<ScaleDetailsResponse>(
      `scales/${scaleId}/musics/${musicId}`,
    );
    return data;
  },

  removeMusic: async (ministryId: number, scaleId: number, musicId: number) => {
    const { data } = await axio.delete<ScaleDetailsResponse>(
      `scales/${scaleId}/musics/${musicId}`,
    );
    return data;
  },

  addMember: async (
    ministryId: number,
    scaleId: number,
    memberId: number,
    request: { functionIds: number[] },
  ) => {
    const { data } = await axio.post<ScaleDetailsResponse>(
      `scales/${scaleId}/members/${memberId}`,
      request,
    );
    return data;
  },

  removeMember: async (
    ministryId: number,
    scaleId: number,
    memberId: number,
  ) => {
    const { data } = await axio.delete<ScaleDetailsResponse>(
      `scales/${scaleId}/members/${memberId}`,
    );
    return data;
  },
};
