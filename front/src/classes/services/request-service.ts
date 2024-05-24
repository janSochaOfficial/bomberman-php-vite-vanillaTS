const connectionSettings = {
  apiLink: "http://localhost/bomberman/api/",
};

export type params = {
  [key: string]: string ;
};

export class RequestService {
  static async Get<TResponse>(
    endpoint: string,
    queryParams: params = {},
    headers: params = {}
  ): Promise<TResponse> {
    const requestUrl = new URL(connectionSettings.apiLink + endpoint);
    for (const key in queryParams) {
        requestUrl.searchParams.append(key, queryParams[key]);
    }
    const response = await fetch(requestUrl.toString(), {
        method: "GET",
        headers: headers,
    })

    if (!response.ok) {
        throw new Error(await response.text());
    }
    
    return await response.json() as TResponse;
  }
}
