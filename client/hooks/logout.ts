import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export type User = {
    id: string;
    name: string;
    username: string;
    type: "local" | "twitter";
};

export function logout() {
    axios.get<any, AxiosResponse<User>>(`http://www.localhost:3001/twitter/logout`, {
        withCredentials: true,
    })
    return null
}