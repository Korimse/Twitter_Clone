import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import TweetC from "components/TweetC";
import TweetFactory from "components/TweetFactory";

const Home = ({ userObj }) => {
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
    return (
        <div className="container">
            <TweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
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