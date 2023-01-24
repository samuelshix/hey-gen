import twitterIcon from "../public/twitter.png";
import Image from "next/image";

const TWITTER_CLIENT_ID = "X3ZMX1o3dnFUaC1RY3Utcnc5N3I6MTpjaQ" // give your twitter client id here

// twitter oauth Url constructor
function getTwitterOauthUrl() {
    const rootUrl = "https://twitter.com/i/oauth2/authorize";
    const options = {
        redirect_uri: "http://www.localhost:3001/oauth/twitter", // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
        client_id: TWITTER_CLIENT_ID,
        state: "state",
        response_type: "code",
        code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
        code_challenge_method: "S256",
        scope: ["users.read", "tweet.read", "follows.read", "tweet.write"].join(" "), // add/remove scopes as needed
    };
    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
}

// the component
export function TwitterOauthButton() {
    return (
        <a className="a-button row-container flex border-none" href={getTwitterOauthUrl()}>
            <p className="mr-3">Log in</p>
            <Image className="w-7" src={twitterIcon} alt="twitter icon" />
        </a>
    );
}