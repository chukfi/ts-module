import { _apiRequestType, ApiUser, LoginResponse } from "../../types/api";
import BaseRequests from "../base";

class AuthRequests extends BaseRequests {
  protected loggedInAsUser: ApiUser | null = null;
  protected accessToken: string = "";

  private apiUrl: string = "";
  constructor(
    _apiRequest: _apiRequestType,
    accessToken: string,
    apiUrl: string,
    getAccessToken?: () => string,
    getLoggedInUser?: () => ApiUser | null,
  ) {
    super(_apiRequest);
    this.accessToken = accessToken;
    this.apiUrl = apiUrl;

    if (getAccessToken) {
      Object.defineProperty(this, "accessToken", {
        get: getAccessToken,
      });
    }

    if (getLoggedInUser) {
      Object.defineProperty(this, "loggedInAsUser", {
        get: getLoggedInUser,
      });
    }

    if (this.accessToken !== "") {
      // auto-fetch user info if access token is provided
      this.whoAmI();
    }
  }

  /**
   *
   * Retrieves information about the currently logged-in user.
   * @remarks This method fetches the user details associated with the current access token.
   * @returns ApiUser, which is the standard typing for any user (also saves in this.loggedInAsUser)
   */
  async whoAmI(): Promise<ApiUser | Error> {
    try {
      const res = await this._apiRequest<{ success: boolean; user: ApiUser }>(
        `/admin/auth/me`,
      );
      if (res instanceof Error) {
        return res;
      }
      this.loggedInAsUser = res.user;
      return res.user;
    } catch (error) {
      return Error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }

  /**
   * Logs in an admin/crm user with the provided email and password.
   * @remarks
   * On successful login, the access token and user information are stored in the instance.
   * @param email The email for the admin/crm account
   * @param password The password for the admin/crm account
   * @returns ApiUser, but also saves in this.loggedInAsUser
   */

  async login(email: string, password: string): Promise<ApiUser | Error> {
    try {
      const response = await fetch(`${this.apiUrl}/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data: LoginResponse = await response.json();

        if (data.success) {
          this.accessToken = data.authToken;
          this.loggedInAsUser = data.user;
          return data.user;
        } else {
          return Error("Login failed");
        }
      } else {
        const readError = await response.json();
        if (readError.error) {
          return Error(`Login failed: ${readError.error}`);
        }
        return Error(`Login failed: ${response.statusText}`);
      }
    } catch (error) {
      return Error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }
}

export default AuthRequests;
