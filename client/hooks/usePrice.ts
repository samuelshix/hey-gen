import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export function usePrice(address: string) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<any | null>(null);

    useEffect(() => {
        setLoading(true);
        axios
            .get<any, AxiosResponse<any>>(`https://public-api.birdeye.so/public/price?address=${address}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': true,

                }
            })
            .then((v) => {
                if (v.data) setData(v.data);
            })
            .catch(() => setError("Not Authenticated"))
            .finally(() => setLoading(false));
    }, []);

    return { error, data, loading };
}