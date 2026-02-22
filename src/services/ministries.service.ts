import axio from "./api";
import type { MinistryDetailResponse } from "../types/ministry";

const MINISTRIES_PATH = "ministries";

export const ministriesService = {
  list: async (): Promise<MinistryDetailResponse[]> => {
    const { data } = await axio.get<MinistryDetailResponse[]>(MINISTRIES_PATH);
    return data;
  },

  findDetails: async (id: number): Promise<MinistryDetailResponse> => {
    const { data } = await axio.get<MinistryDetailResponse>(
      `${MINISTRIES_PATH}/${id}`
    );
    return data;
  }
};
