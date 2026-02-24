import axio from "./api";
import type {
  MinistryDetailResponse,
  MinistryRequest,
  MinistryResponse,
} from "../types/ministry";

const MINISTRIES_PATH = "ministries";

export const ministriesService = {
  list: async (): Promise<MinistryDetailResponse[]> => {
    const { data } = await axio.get<MinistryDetailResponse[]>(MINISTRIES_PATH);
    return data;
  },

  findDetails: async (id: number): Promise<MinistryDetailResponse> => {
    const { data } = await axio.get<MinistryDetailResponse>(
      `${MINISTRIES_PATH}/${id}`,
    );
    return data;
  },

  create: async (
    ministry: MinistryRequest,
    avatarImage?: File | null,
  ): Promise<MinistryResponse> => {
    const formData = new FormData();

    formData.append(
      "request",
      new Blob([JSON.stringify(ministry)], { type: "application/json" }),
    );

    if (avatarImage) {
      formData.append("avatarImage", avatarImage);
    }

    const { data } = await axio.post<MinistryResponse>(
      MINISTRIES_PATH,
      formData,
    );
    return data;
  },
};
