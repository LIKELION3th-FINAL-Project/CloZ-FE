import api from "./client";
import type { AgentRequest, AgentResponse } from "@/types";

// 에이전트 메시지 전송
export const sendMessage = async (
  data: AgentRequest
): Promise<AgentResponse> => {
  const response = await api.post<AgentResponse>("/api/agents/", data);
  return response.data;
};
