import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet, httpPost } from '@/services/http.helpers';
import type {
	AuthLoginPayload,
	AuthRegisterPayload,
	AuthTokenResponse,
	AuthUserResponse,
} from '@/types/auth';

export const AuthService = {
	login: (payload: AuthLoginPayload) =>
		httpPost<AuthTokenResponse>(API_ENDPOINTS.AUTH.LOGIN, payload),

	register: (payload: AuthRegisterPayload) =>
		httpPost<AuthTokenResponse>(API_ENDPOINTS.AUTH.REGISTER, payload),

	refreshToken: (_token?: string) => httpPost<AuthTokenResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN),

	getUserProfile: async (userId: number, token?: string) => {
		const profile = await httpGet<AuthUserResponse>(API_ENDPOINTS.USER.USER_PROFILE(userId), {
			headers: token ? { Authorization: `Bearer ${token}` } : undefined,
		});
		return profile;
	},
};

export function getTokenFromAuthResponse(response: AuthTokenResponse): string | null {
	return response.token ?? response.access_token ?? response.jwt ?? null;
}
