import axio from "./api";
import type { FunctionResponse } from "../types/function";

const FUNCTIONS_PATH = "functions";

export const functionsService = {
  list: async (): Promise<FunctionResponse[]> => {
    const { data } = await axio.get<FunctionResponse[]>(FUNCTIONS_PATH);
    return data;
  },
};
