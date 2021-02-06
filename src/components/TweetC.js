import { dbService } from "fbase";
import React, { useState } from "react";

const TweetC = ({ tweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newTweet, setnewTweet] = useState(tweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet??");
        console.log(ok)
        if (ok) {
            await dbService.doc(`tweets/${tweetObj.id}`).delete();
        }
    };
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`tweets/${tweetObj.id}`).update({
            text: newTweet,
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setnewTweet(value);
    }
    return (
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            placeholder="Edit your nweet"
                            value={newTweet}
                            required
                            onChange={onChange}
                        />
                        <input type="submit" value="Update Tweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                    <>
                        <h4>{tweetObj.text}</h4>
                        {tweetObj.attachmentUrl && (<img src={tweetObj.attachmentUrl} width="50px" height="50px" />)}
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete Tweet</button>
                                <button onClick={toggleEditing}>Edit Tweet</button>
                            </>
                        )}
                    </>
                )}
        </div>
    );
};
export default TweetC;