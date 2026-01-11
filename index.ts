// chukfi react helper :)

import AuthRequests from "./src/requests/auth";
import CollectionRequests from "./src/requests/collections";
import { ApiUser, LoginResponse, Schemas, TableSchema } from "./src/types/api";
import { FetchType } from "./src/types/types";

function fetchTypeToString(fetchType: FetchType): string {
  switch (fetchType) {
    case FetchType.GET:
      return "GET";
    case FetchType.POST:
      return "POST";
    case FetchType.PUT:
      return "PUT";
    case FetchType.DELETE:
      return "DELETE";
    default:
      return "GET";
  }
}

class Chukfi {
  apiUrl: string = "";
  requests;

  loggedInUser: ApiUser | null = null;
  accessToken: string = "";

  constructor(apiUrl: string, accessToken: string = "") {
    this.apiUrl = apiUrl;

    this.requests = {
      collections: new CollectionRequests(this._apiRequest.bind(this)),
      auth: new AuthRequests(
        this._apiRequest.bind(this),
        accessToken,
        this.apiUrl,
        () => this.accessToken,
        (token: string) => { this.accessToken = token; },
        () => this.loggedInUser,
        (user: ApiUser | null) => { this.loggedInUser = user; },
      ),
    };
  }

  private async _apiRequest<T>(
    endpoint: string,
    fetchType?: FetchType,
    requiresAuth: boolean = true,
    body?: any,
  ): Promise<T | Error> {
    console.log("API Request to:", `${this.apiUrl}${endpoint}`);
    console.log("Token:", this.accessToken);
    if (requiresAuth && !this.accessToken) {
      return Error("No access token provided");
    }

    if (!fetchType) {
      fetchType = FetchType.GET;
    }

    try {
      let response = await fetch(`${this.apiUrl}${endpoint}`, {
        ...(requiresAuth
          ? {
              headers: {
                Authorization: `Bearer ${this.accessToken}`,
              },
            }
          : {}),
        method: fetchTypeToString(fetchType),
        ...(body ? { body: JSON.stringify(body) } : {}),
      });

      if (response.ok) {
        const data: T = await response.json();
        return data;
      } else {
        const readError = await response.json();
        if (readError.error) {
          return Error(`API request failed: ${readError.error}`);
        }
        return Error(`API request failed: ${response.statusText}`);
      }
    } catch (error) {
      return Error(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  }
}

export default Chukfi;
