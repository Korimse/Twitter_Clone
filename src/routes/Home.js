import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import TweetC from "components/TweetC";

const Home = ({ userObj }) => {
    const [Tweet, setTweet] = useState("");
    const [tweets, settweets] = useState([]);
    useEffect(() => {
        dbService.collection("tweets").onSnapshot(snapshot => {
            const tweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            settweets(tweetArray);
        });
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("tweets").add({
            text: Tweet,
            createAt: Date.now(),
            creatorID: userObj.uid,
        });
        setTweet("");
    };
    const onChange = (event) => {
        const { target: { value }, } = event;
        setTweet(value);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={Tweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="submit" placeholder="Tweet" />
            </form>
            <div>
                {tweets.map(Tweet => (
                    <TweetC key={Tweet.id}
                        tweetObj={Tweet}
                        isOwner={Tweet.creatorID === userObj.uid}
                    />
                ))}
            </div>
        </div>
    )
}
export default Home;