import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from "react";
import TweetC from "components/TweetC";

const Home = ({ userObj }) => {
    const [Tweet, setTweet] = useState("");
    const [tweets, settweets] = useState([]);
    const [attachment, setAttachment] = useState("");
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
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const tweetObj = {
            text: Tweet,
            createAt: Date.now(),
            creatorID: userObj.uid,
            attachmentUrl,
        }
        await dbService.collection("tweets").add(tweetObj);
        setTweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const { target: { value }, } = event;
        setTweet(value);
    }
    const onFileChange = (event) => {
        const { target: { files }, } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }, } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachment = () => { setAttachment("") }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={Tweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" placeholder="Tweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
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