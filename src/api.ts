import axios from 'axios';

const BASE_URL = 'http://localhost:8000';


export async function fetchMetrics(): Promise<any> {
    const resp = await axios.get(BASE_URL + '/api/metric/');
    return resp.data;
}
