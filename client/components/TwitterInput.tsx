import EmojiPicker, { Emoji, EmojiClickData } from "emoji-picker-react";
import { AppProps } from "next/app";
import React, { ReducerAction, useEffect, useState } from "react";
import { setSourceMapRange } from "typescript";
import SendIcon from "../public/send.svg"
import Image from "next/image";
import { usePostTweet } from "@/hooks/usePostTweet";
import axios, { AxiosResponse } from "axios";

export type Tweet = {
    id: string;
    text: string;
};

export function TwitterInput(props: { message: string }) {
    const [msg, setMsg] = useState(props.message);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setMsg(props.message)
    }, [props.message])

    function placeEmoji(emojiData: EmojiClickData, event: MouseEvent) {
        let message = msg;
        message += emojiData.emoji;
        setMsg(message)
    }

    function toggleEmojiMenu() {
        setShowEmojiPicker(!showEmojiPicker);
        // const datePicker = document.getElementById("emojiPicker")?.style
        // if(datePicker?.display === 'none') datePicker.display = 'block'
        // else datePicker.display = 'none'
    }
    function handleSubmit(e: React.SyntheticEvent) {
        e.preventDefault();
        console.log(msg)
        axios
            .get<any, AxiosResponse<Tweet>>(`http://www.localhost:3001/tweet?text=${msg}`, {
                withCredentials: true,
            })
            .then((v) => {
                console.log(v.data)
            })
            .catch(() => setError("Not Authenticated"))
            .finally(() => setLoading(false));
        // const { data: tweet } = usePostTweet(msg)
        // console.log(tweet)
    }

    return (
        <div className="z-0">
            <form className="input-container h-auto"
                onSubmit={e => { handleSubmit(e) }}
            // onSubmit={(event) => sendChat(event)}
            >
                <div className="flex mb-5 relative">
                    <input
                        type="text"
                        key={props.message}
                        placeholder="Type your tweet here"
                        onChange={(e) => setMsg(e.target.value)}
                        value={msg}
                        className="bg-slate-700 rounded-lg w-full h-20 p-3 border-cyan-100 shadow-xl text-slate-300"
                    />
                    {/* <button className="font-bold absolute right-5 rounded-md text-slate-400 top-4 bg-slate-600 p-3 transition ease-in-out hover:shadow hover:shadow-slate-500  hover:bg-slate-500 hover:scale-105" onClick={toggleEmojiMenu}>😃</button> */}
                    {/* <button type="submit" className="h-12 absolute right-8 top-4 bg-slate-600 rounded-md transition ease-in-out hover:shadow hover:shadow-slate-500 hover:bg-slate-500 hover:scale-105 pt-[5px] px-1">
                        <Image className="w-10" src={SendIcon} alt="twitter icon" />
                    </button> */}
                </div>
                {/* <div id="emojiPicker" className="float-right" style={{ display: showEmojiPicker ? 'block' : 'none' }}>
                    <EmojiPicker onEmojiClick={placeEmoji} theme="dark" />
                </div> */}
            </form>
        </div>
    );
}