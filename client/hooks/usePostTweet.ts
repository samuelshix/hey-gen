import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export type Tweet = {
    id: string;
    text: string;
};

export function usePostTweet(text: string) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Tweet | null>(null);
    axios
        .post<any, AxiosResponse<Tweet>>(`http://www.localhost:3001/tweet?text=${text}`, {
            withCredentials: true,
        })
        .then((v) => {
            if (v.data) setData(v.data);
        })
        .catch(() => setError("Not Authenticated"))
        .finally(() => setLoading(false));

    return { error, data, loading };
}