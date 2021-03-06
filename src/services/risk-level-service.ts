const AUTH_ENDPOINT = "https://access.xapix.io/oauth2/token"
const BASE = "https://api.xapix.dev/covid-19";

// TODO: Figure out a way in order to avoid using auth for all-access API
// endpoints, and rotate out secrets.
const CLIENT_ID = "3tSStBF7ykV59bsSjRCtLUM1"
const CLIENT_SECRET = "1wL1u5PrwJEQNQoZCeBqerS3"

export const ENDPOINTS = {
  riskLevelByGeoPos: `${BASE}/pois/risk-level-by-geopos`, // POST
};

export const riskLevelByGeoPos = async (
  latitude: number,
  longitude: number
) => {
  try {
    const auth_reqbody : { [key: string]: string } = {
      'client_id': CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      'grant_type': 'client_credentials'
    }
    const auth_formdata = new FormData();
    for (let key in auth_reqbody) {
      auth_formdata.append(key, auth_reqbody[key])
    }

    console.log("GETTING ACCESS TOKEN")

    const auth_response = await fetch(
      'https://cors-anywhere.herokuapp.com/' + AUTH_ENDPOINT,
      {
        "method": "POST",
        body: auth_formdata
      }
    )
    const auth_json = await auth_response.json();

    const access_token = auth_json.access_token;

    const api_headers = new Headers();
    api_headers.append("Content-Type", "application/json")
    api_headers.append("Authorization", "Bearer " + access_token)

    console.log("FETCHING DATA")

    let latitude_str = latitude.toString();
    let longitude_str = longitude.toString();

    if (latitude > 0) {
      latitude_str = "+" + latitude_str;
    }
    if (longitude > 0) {
      longitude_str = "+" + longitude_str;
    }

    const api_response = await fetch(
      'https://cors-anywhere.herokuapp.com/' + ENDPOINTS.riskLevelByGeoPos,
      {
        "method": "POST",
        "headers": api_headers,
        "body" : JSON.stringify({
          "state": "",
          "latitude": "+40.6700",
          "longitude": "-73.9400"
        })
      }
    );
    const api_resp_json = await api_response.json()
    return api_resp_json;

} catch(e) {
  const errorMessage = `Failed to fetch riskLevelByGeoPos for: ${{latitude, longitude}})}`
  const err = new Error(errorMessage)
  console.error(errorMessage, e)
  throw err;
}
};
