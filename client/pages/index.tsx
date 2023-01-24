import { Generator } from "@/components/Generator";
import type { NextPage } from "next";
import { TwitterOauthButton } from "../components/TwitterOauthButton";
import { useMeQuery } from "../hooks/useMeQuery";
import { logout } from "@/hooks/logout";
const Home: NextPage = () => {
    const { data: user } = useMeQuery();

    function logoutFn() {
        window.location.reload();
        logout()
    }
    return (
        <div className="text-white column-container bg-slate-800 px-[20%] pt-10 sm:px[10%] h-full pb-64">
            <div className="flex justify-between w-full border-2 border-cyan-100 rounded-lg shadow-white/40 shadow-md p-3 mb-36 mt-10">
                <div className="">
                    <p className="font-bold text-3xl">HeyGen</p>
                    <p className="font-thin">By ☉xSam </p>
                </div>
                <div className="mt-4">
                    {user ?
                        <a onClick={logoutFn} target="_blank" className="cursor-pointer">{user.name}</a>
                        :
                        <div className="hover:scale-105 transition">
                            <TwitterOauthButton />
                        </div>
                    }
                </div>
            </div>
            <div>
                <Generator />
            </div>
        </div>
    );
};

export default Home;