import axio from "./api";
import type { MemberResponse } from "../types/member";

const MINISTRIES_PATH = "ministries";

export const membersService = {
  listByMinistry: async (ministryId: number): Promise<MemberResponse[]> => {
    const { data } = await axio.get<MemberResponse[]>(
      `${MINISTRIES_PATH}/${ministryId}/members`,
    );

    return data;
  },
};
