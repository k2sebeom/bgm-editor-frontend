import axios from 'axios';

export const BASE_URL = 'http://localhost:8000' // 'http://3.139.108.166';


export async function fetchMetrics(): Promise<any> {
    const resp = await axios.get(BASE_URL + '/api/metric/');
    return resp.data;
}


export async function fetchSongs(mood: string, genre: string): Promise<any> {
    const resp = await axios.get(BASE_URL + `/api/song/?genre=${genre}&mood=${mood}&limit=5`);
    return resp.data;
}

export async function submitVideo(file: File, bgms: any) {
    const formData = new FormData();
    formData.append('video', file);
    bgms.forEach((b: any) => {
        formData.append('starts', b.range[0]);
        formData.append('ends', b.range[1]);
        formData.append('ids', b.clipId);
    });
    const resp = await axios(BASE_URL + '/api/process/', {
        method: "post",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
        responseType: 'blob'
    });
    return resp.data;
}