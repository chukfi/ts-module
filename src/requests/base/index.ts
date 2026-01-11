import { _apiRequestType } from "../../types/api";

class BaseRequests {
  protected _apiRequest: _apiRequestType;

  constructor(_apiRequest: _apiRequestType) {

    this._apiRequest = _apiRequest;
  }
}

export default BaseRequests;
