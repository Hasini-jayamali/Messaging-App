import { createSlice } from '@reduxjs/toolkit'

const messagesSlice = createSlice({
    name: 'messages',
    initialState: [],
    reducers: {
        addMessage: (state, action) => {
            state.push(action.payload)
        },
        upvoteMessage: (state, action) => {
            const { messageId, replyIndex } = action.payload
            const message = state.find(msg => msg.id === messageId)
            if (message) {
                if (replyIndex !== undefined && replyIndex >= 0 && replyIndex < message.replies.length) {
                    message.replies[replyIndex].upvotes = (message.replies[replyIndex].upvotes || 0) + 1
                } else {
                    message.upvotes = (message.upvotes || 0) + 1
                }
            }
        },
        downvoteMessage: (state, action) => {
            const { messageId, replyIndex } = action.payload
            const message = state.find(msg => msg.id === messageId)
            if (message) {
                if (replyIndex !== undefined && replyIndex >= 0 && replyIndex < message.replies.length) {
                    message.replies[replyIndex].downvotes = (message.replies[replyIndex].downvotes || 0) + 1
                } else {
                    message.downvotes = (message.downvotes || 0) + 1
                }
            }
        },
    },
})

export const { addMessage, upvoteMessage, downvoteMessage } = messagesSlice.actions

export default messagesSlice.reducer
