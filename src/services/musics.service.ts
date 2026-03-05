import axio from "./api";
import type { MusicResponse } from "../types/music";
import type { PaginatedResponse } from "../types/page";

const MINISTRIES_PATH = "ministries";

interface MusicListParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
}

export const musicService = {
  listByMinistry: async (
    ministryId: number,
    params: MusicListParams = {},
  ): Promise<PaginatedResponse<MusicResponse>> => {
    const { data } = await axio.get<PaginatedResponse<MusicResponse>>(
      `${MINISTRIES_PATH}/${ministryId}/musics`,
      { params },
    );

    return data;
  },

  addToScale: async (
    ministryId: number,
    scaleId: number,
    musicId: number,
  ): Promise<void> => {
    await axio.post(
      `${MINISTRIES_PATH}/${ministryId}/scales/${scaleId}/musics/${musicId}`,
    );
  },

  removeFromScale: async (
    ministryId: number,
    scaleId: number,
    musicId: number,
  ): Promise<void> => {
    await axio.delete(
      `${MINISTRIES_PATH}/${ministryId}/scales/${scaleId}/musics/${musicId}`,
    );
  },
};
