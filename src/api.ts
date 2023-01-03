import axios from 'axios';

export const BASE_URL = 'http://localhost:8000';


export async function fetchMetrics(): Promise<any> {
    const resp = await axios.get(BASE_URL + '/api/metric/');
    return resp.data;
}


export async function fetchSongs(mood: string, genre: string): Promise<any> {
    const resp = await axios.get(BASE_URL + `/api/song/?genre=${genre}&mood=${mood}&limit=5`);
    return resp.data;
}