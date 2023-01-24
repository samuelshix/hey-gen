import EmojiPicker, { Emoji, EmojiClickData } from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import { setSourceMapRange } from "typescript";
import { TwitterInput } from "./TwitterInput";
import axios, { AxiosResponse } from "axios"
// import { usePrice } from "@/hooks/usePrice";

async function usePrice(address: string) {
    const response = await axios.get<any, AxiosResponse<any>>(`https://public-api.birdeye.so/public/price?address=${address}`, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': true,
        }
    })
    return response.data.data
}
const addressMappings: any = {
    "$SOL": "So11111111111111111111111111111111111111112",
    "$BONK": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "$SAMO": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    "$CHILI": "GPyzPHuFFGvN4yWWixt6TYUtDG49gfMdFFi2iniTmCkh",
    "$FRONK": "5yxNbU8DgYJZNi3mPD9rs4XLh9ckXrhPjJ5VCujUWg5H",
    "$FIDA": "EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp"
}

export function Generator() {
    const [message, setMsg] = useState("");
    const [amount, setAmount] = useState("")
    const [currency, setCurrency] = useState("")
    const [numberGiveaways, setNumberGiveaways] = useState("")
    const [showTweetDraft, setShowTweetDraft] = useState(false)
    const [validateForm, setValidateForm] = useState(false)
    const [errorAlert, setErrorAlert] = useState(false)
    const [price, setPrice] = useState(0)

    useEffect(() => {
        if (parseInt(amount) > 0 && parseInt(numberGiveaways) > 0 && currency) {
            (async () => {
                const { value: price } = await usePrice(addressMappings[currency]);
                setPrice(price)
            })()
            setValidateForm(true)
        }
        else setValidateForm(false)
        setMsg(`@hey_wallet send ${amount} ${currency} to the first ${numberGiveaways} follows and retweets.`)
        setMsg(`@hey_wallet send ${amount} ${currency} to the first ${numberGiveaways} follows and retweets.`)
    }, [amount, currency, numberGiveaways])

    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault();
    }
    const toggleTweetDraft = () => {
        if (!validateForm) setErrorAlert(true)
        else {
            setErrorAlert(false)
            setShowTweetDraft(!showTweetDraft);
        }
    }

    return (
        <div className="">
            <p className="text-5xl font-black text-slate-200 mb-5">Create Tweet</p>
            {
                errorAlert &&
                <div className="bg-red-400 rounded-md p-3 w-64 mb-5">
                    <p>Missing/incorrect input fields!</p>
                </div>
            }
            <div className="flex 2xl:flex-row flex-col  mb-36">
                <div className="text-slate-200 bg-slate-700/10 rounded-lg font-bold shadow-xl p-7 pt-8 inline-block mr-5 mb-5">
                    <form className="" onSubmit={e => { handleSubmit(e) }}>
                        <div className="flex xl:flex-row flex-col">
                            <div className="flex mb-5">
                                <p className="mr-5 text-4xl font-black">Send</p>
                                <input id="amount" value={amount} placeholder="10000" type="text" name="amount" className="p-3 mr-5 w-36 bg-slate-700 h-10 rounded-lg focus:border-0" onChange={e => setAmount(e.target.value)}></input>
                                <select id="currency" value={currency} placeholder="$BONK" name="currency" className="p-3 mr-5 w-36 text-sm h-10 bg-slate-700 rounded-lg" onChange={e => setCurrency(e.target.value)}>
                                    <option className="" value=""></option>
                                    <option className="" value="$BONK">$BONK</option>
                                    <option value="$SOL">$SOL</option>
                                    <option value="$FRONK">$FRONK</option>
                                    <option value="$CHILI">$CHILI</option>
                                    <option value="$FIDA">$FIDA</option>
                                </select>
                            </div>
                            <div className="flex">
                                <p className="mr-5 text-4xl font-black">to</p>
                                <input id="number-giveaways" value={numberGiveaways} placeholder="100" type="text" name="numberGiveaways" className="w-36 md:w-24 p-3 h-10 mr-5 bg-slate-700 rounded-lg" onChange={e => setNumberGiveaways(e.target.value)}></input>
                                <p className="mr-12 text-4xl font-black">people.</p>
                            </div>
                        </div>
                        <button type="submit" onClick={toggleTweetDraft} className="text-xl font-bold rounded-lg bg-slate-700 p-0 relative h-11 w-24 transition ease-in-out hover:shadow-sm hover:shadow-white/30 float-right">
                            <div className="bg-white absolute w-5 h-5 bottom-[7px] left-[39px]"></div>
                            <img className="transition ease-in-out z-10 absolute top-[-6px] left-[20px]" src="https://img.icons8.com/ios-filled/50/334155/enter-mac-key.png" />
                        </button>
                    </form>
                </div>
                {validateForm &&
                    <div className="text-slate-200 inline-block sm:block p-5 shadow-lg bg-slate-700/40 rounded-lg">
                        <div className="mt-3">
                            <p className="xl:text-2xl"> Total Giveaway</p>
                            <p className="text-4xl font-black">{parseInt(amount) * parseInt(numberGiveaways)} {currency}
                            </p>
                            <p className="">~${parseInt(amount) * parseInt(numberGiveaways) * price}</p>
                        </div>
                    </div>
                }
            </div>
            <p className="text-5xl font-black text-slate-200 mb-5">Edit Tweet</p>
            <div className="p-5 shadow-xl bg-slate-700/10 mb-10 relative rounded-lg">
                {
                    (!showTweetDraft || !validateForm) &&
                    <div className="w-full h-full bg-slate-800/30 absolute left-0 top-0 rounded-lg backdrop-blur-[3px] z-10"></div>
                }
                <TwitterInput message={message} />
                <a target="_blank" href={`https://twitter.com/intent/tweet?text=${message}`}><button className="text-xl font-bold text-slate-200 bg-slate-700 mr-5 px-3 py-1 rounded-lg transition ease-in-out hover:bg-slate-600 hover:scale-105 hover:shadow-lg">Edit/Post on Twitter ✏️</button></a>
            </div>
        </div >
    );
}