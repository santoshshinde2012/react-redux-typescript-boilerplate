import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseTransformer,
} from "axios";

export default class HttpClient {
  // Here you can use your server URL

  private static readonly baseURL: string =
    process.env.REACT_APP_API_BASEURL || "http://localhost:3000";

  private static transformResponse(
    input: string
  ): AxiosResponseTransformer | AxiosResponseTransformer[] {
    return JSON.parse(input);
  }

  private static client(header = {}): AxiosInstance {
    // cancelToken and source declaration
    const cancelTokenSource = axios.CancelToken.source();

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...header,
    };

    // axios client config
    const config: AxiosRequestConfig = {
      baseURL: this.baseURL,
      cancelToken: cancelTokenSource.token,
      headers,
    };

    // axios client response transformer
    config.transformResponse = [
      (data) => {
        return data && typeof data === "string"
          ? this.transformResponse(data)
          : data;
      },
    ];

    // create axios client
    return axios.create(config);
  }

  /**
   *
   * @param url
   * @returns
   */
  public static get(url: string): Promise<AxiosResponse> {
    return this.client().get(url);
  }

  /**
   *
   * @param url
   * @param payload
   * @returns
   */
  public static post<T>(url: string, payload: T): Promise<AxiosResponse> {
    return this.client().post(url, payload);
  }

  public static patch<T>(url: string, payload: T): Promise<AxiosResponse> {
    return this.client().patch(url, payload);
  }

  public static put<T>(url: string, payload: T): Promise<AxiosResponse> {
    return this.client().put(url, payload);
  }

  public static delete(url: string): Promise<AxiosResponse> {
    return this.client().delete(url);
  }
}
