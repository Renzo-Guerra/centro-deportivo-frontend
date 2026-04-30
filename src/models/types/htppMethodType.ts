const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;

export type HttpMethodType = typeof HTTP_METHODS[number];