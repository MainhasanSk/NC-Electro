import { ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export class ApiException extends Error {
  code: string;
  details?: Record<string, unknown>;
  requestId?: string;
  status: number;

  constructor(code: string, message: string, status: number, details?: Record<string, unknown>, requestId?: string) {
    super(message);
    this.name = 'ApiException';
    this.code = code;
    this.status = status;
    this.details = details;
    this.requestId = requestId;
  }
}

/**
 * Maps raw backend error codes into human-friendly messages as defined in LLD and Spec
 */
export function mapErrorCodeToUserMessage(code: string, defaultMessage?: string): string {
  switch (code) {
    case 'ORDER_ALREADY_ACCEPTED':
      return 'Another Sub-Admin has already accepted this order first.';
    case 'ORDER_INVALID_TRANSITION':
      return 'This order cannot transition to the selected stage.';
    case 'INSUFFICIENT_STOCK':
      return 'One or more items in your cart are no longer available in the requested quantity.';
    case 'DOCUMENT_NOT_READY':
      return 'Your order invoice is still being prepared by our system. Please check back shortly.';
    case 'VALIDATION_FAILED':
      return defaultMessage || 'Please check your form inputs and try again.';
    case 'UNAUTHENTICATED':
      return 'Please sign in to continue.';
    case 'FORBIDDEN':
      return 'You do not have permission to perform this operational action.';
    case 'RESOURCE_NOT_FOUND':
      return 'The requested resource could not be found.';
    case 'RATE_LIMITED':
      return 'Too many requests. Please slow down and try again.';
    default:
      return defaultMessage || 'Something went wrong. Please try again.';
  }
}

export interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('nc_access_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.idempotencyKey) {
    headers['Idempotency-Key'] = options.idempotencyKey;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorData: { error?: { code?: string; message?: string; details?: Record<string, unknown> }; request_id?: string } = {};
      try {
        errorData = await response.json();
      } catch {
        // Fallback for non-JSON error
      }

      const code = errorData?.error?.code || 'INTERNAL_ERROR';
      const rawMessage = errorData?.error?.message;
      const friendlyMessage = mapErrorCodeToUserMessage(code, rawMessage);

      throw new ApiException(code, friendlyMessage, response.status, errorData?.error?.details, errorData?.request_id);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: unknown) {
    if (err instanceof ApiException) {
      throw err;
    }
    throw new ApiException('NETWORK_ERROR', 'Unable to connect to NC Electro server. Please check your network.', 500);
  }
}
