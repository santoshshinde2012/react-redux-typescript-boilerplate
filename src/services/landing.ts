import Storage from "../utils/local-storage";
import HttpClient from "./http-client";

export interface ILandingInfo {
  id: number;
  title: string;
  description: string;
  background?: string;
}

enum Landing {
  LANDING_PAGE = "landing",
}

export default class LandingServices {
  public static readonly GET_LANDING_PAGE_INFO =
    "/global/mock-data/landing.json";

  private static async landing() {
    const { data } = await HttpClient.get(`${this.GET_LANDING_PAGE_INFO}`);
    await Storage.setItem(Landing.LANDING_PAGE, JSON.stringify(data));
    return data;
  }

  public static async getLandingPageInfo() {
    const response =
      (await Storage.getItem(Landing.LANDING_PAGE)) ||
      (await LandingServices.landing());

    return response;
  }
}
