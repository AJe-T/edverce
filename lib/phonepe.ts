type PhonePeTokenCache = {
  accessToken: string;
  expiresAtMs: number;
} | null;

let tokenCache: PhonePeTokenCache = null;

type CreatePhonePePaymentInput = {
  merchantOrderId: string;
  amount: number;
  redirectUrl: string;
  courseId: string;
  userId: string;
  couponCode?: string;
};

export type PhonePeCreatePaymentResponse = {
  orderId?: string;
  state?: string;
  expireAt?: number;
  redirectUrl?: string;
  code?: string;
  message?: string;
  data?: {
    redirectUrl?: string;
    paymentUrl?: string;
    instrumentResponse?: {
      redirectInfo?: {
        url?: string;
      };
    };
  };
  paymentUrl?: string;
  instrumentResponse?: {
    redirectInfo?: {
      url?: string;
    };
  };
};

const getPhonePeBaseUrl = () => {
  return process.env.PHONEPE_BASE_URL || "https://api-preprod.phonepe.com/apis/pg-sandbox";
};

const getRequiredPhonePeConfig = () => {
  const clientId = process.env.PHONEPE_CLIENT_ID;
  const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
  const clientVersion = process.env.PHONEPE_CLIENT_VERSION;

  if (!clientId || !clientSecret || !clientVersion) {
    throw new Error("Missing PhonePe credentials");
  }

  return { clientId, clientSecret, clientVersion };
};

const getTokenUrl = () => {
  const authUrl = process.env.PHONEPE_AUTH_URL;
  if (authUrl) {
    return authUrl;
  }

  return "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
};

const getPhonePeAuthToken = async () => {
  const now = Date.now();
  if (tokenCache && tokenCache.expiresAtMs - 30_000 > now) {
    return tokenCache.accessToken;
  }

  const { clientId, clientSecret, clientVersion } = getRequiredPhonePeConfig();
  const tokenUrl = getTokenUrl();

  const body = new URLSearchParams({
    client_id: clientId,
    client_version: clientVersion,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PhonePe auth failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_at?: number;
  };

  if (!data.access_token) {
    throw new Error("PhonePe auth failed: access_token missing");
  }

  const expiresAtMs = data.expires_at ? data.expires_at * 1000 : now + 15 * 60 * 1000;
  tokenCache = {
    accessToken: data.access_token,
    expiresAtMs,
  };

  return data.access_token;
};

const phonePeRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const token = await getPhonePeAuthToken();
  const response = await fetch(`${getPhonePeBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PhonePe API failed: ${response.status} ${text}`);
  }

  return (await response.json()) as T;
};

export const createPhonePePayment = async (
  input: CreatePhonePePaymentInput,
) => {
  const payload = {
    merchantOrderId: input.merchantOrderId,
    amount: input.amount,
    expireAfter: 1200,
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: input.redirectUrl,
      },
    },
    metaInfo: {
      udf1: input.userId,
      udf2: input.courseId,
      udf3: input.couponCode || "",
    },
  };

  return await phonePeRequest<PhonePeCreatePaymentResponse>("/checkout/v2/pay", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const getPhonePeRedirectUrl = (
  paymentResponse: PhonePeCreatePaymentResponse,
) => {
  return (
    paymentResponse.redirectUrl ||
    paymentResponse.paymentUrl ||
    paymentResponse.instrumentResponse?.redirectInfo?.url ||
    paymentResponse.data?.redirectUrl ||
    paymentResponse.data?.paymentUrl ||
    paymentResponse.data?.instrumentResponse?.redirectInfo?.url
  );
};

export const getPhonePeOrderStatus = async (merchantOrderId: string) => {
  return await phonePeRequest<{
    orderId: string;
    state: string;
    amount: number;
    paymentDetails?: Array<{ state?: string }>;
    metaInfo?: {
      udf1?: string;
      udf2?: string;
      udf3?: string;
    };
  }>(`/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status?details=true`);
};
