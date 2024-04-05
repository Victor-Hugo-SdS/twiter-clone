import { useMemo, useState } from 'react';
import { mutate } from 'swr';
import { useApi } from '../useApi';
import { ApiService } from '../../services/ApiService';

export function useIndex() {
    const maxTextLength = 150,
        user = {
            name:'Hugo',
            username: 'vhugosds',
            picture: 'https://github.com/Victor-Hugo-SdS.png',
        },
        [text, setText] = useState(''),
        tweetList = useApi('tweets').data,
        sortedTweetList = useMemo(() => {
            return (tweetList || []).sort((a, b) => 
                a.data.date < b.data.date ? 1 : -1
            );
        }, [tweetList]);

    function onTextChange(event) {
        const text = event.target.value;
        if(text.length <= maxTextLength){
            setText(text);
        }
    }

    async function sendTweet() {
        await ApiService.post('tweets', {
            data: {
                user,
                text,
                date: new Date().toISOString(),
            },
        });
        setText('');
        mutate('tweets');
    }

    return {
        user,
        text,
        onTextChange,
        maxTextLength,
        sendTweet,
        sortedTweetList,
    };
}

