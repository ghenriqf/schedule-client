export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: ApiErrorCode;
  public readonly details: unknown;

  constructor(
    status: number,
    message: string,
    code: ApiErrorCode,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static fromStatus(status: number, data: unknown): ApiError {
    const message = ApiError.extractMessage(data);

    switch (status) {
      case 401:
        return new ApiError(
          status,
          message ?? "Sessão expirada.",
          "UNAUTHORIZED",
          data,
        );
      case 403:
        return new ApiError(
          status,
          message ?? "Acesso negado.",
          "FORBIDDEN",
          data,
        );
      case 404:
        return new ApiError(
          status,
          message ?? "Recurso não encontrado.",
          "NOT_FOUND",
          data,
        );
      case 400:
        return new ApiError(
          status,
          message ?? "Dados inválidos.",
          "VALIDATION",
          data,
        );
      case 409:
        return new ApiError(
          status,
          message ?? "Conflito ao processar a requisição.",
          "CONFLICT",
          data,
        );
      case 500:
        return new ApiError(
          status,
          message ?? "Erro interno do servidor.",
          "SERVER_ERROR",
          data,
        );
      default:
        return new ApiError(
          status,
          message ?? "Ocorreu um erro inesperado.",
          "UNKNOWN",
          data,
        );
    }
  }

  static network(): ApiError {
    return new ApiError(
      0,
      "Servidor indisponível. Verifique sua conexão.",
      "NETWORK_ERROR",
    );
  }

  private static extractMessage(data: unknown): string | null {
    if (!data || typeof data !== "object") return null;
    const obj = data as Record<string, unknown>;

    // formato ExceptionResponse: { code, message, status }
    if (typeof obj.message === "string") return obj.message;

    // formato validação: { field: "mensagem", field2: "mensagem2" }
    // retorna todas as mensagens de validação concatenadas
    const validationMessages = Object.entries(obj)
      .filter(([, v]) => typeof v === "string")
      .map(([field, msg]) => `${field}: ${msg}`);

    if (validationMessages.length > 0) return validationMessages.join(" — ");

    return null;
  }
}
