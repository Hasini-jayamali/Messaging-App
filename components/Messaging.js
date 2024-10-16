import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { addMessage, upvoteMessage, downvoteMessage } from '../store/messagesSlice'

export default function Messaging() {
    const dispatch = useDispatch()
    const messages = useSelector((state) => state.messages)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        const newMessage = {
            id: Date.now(),
            text: data.message,
            user: data.user,
            upvotes: 0,
            downvotes: 0,
            replies: [],
            picture: 'https://randomuser.me/api/portraits/men/1.jpg',
        }
        dispatch(addMessage(newMessage))
        reset()
    }

    const handleReply = (id, reply) => {
        const messageIndex = messages.findIndex((msg) => msg.id === id);
        if (messageIndex !== -1) {
            const newReply = {
                text: reply,
                upvotes: 0,
                downvotes: 0,
            };

            const updatedMessage = {
                ...messages[messageIndex],
                replies: [...messages[messageIndex].replies, newReply],
            };

            dispatch(addMessage(updatedMessage));
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <input
                    {...register("user", { required: true })}
                    placeholder="Your Name"
                    className="border p-2 rounded w-full mb-2"
                />
                <textarea
                    {...register("message", { required: true })}
                    placeholder="Type your message"
                    className="border p-2 rounded w-full mb-2"
                />
                {errors.message && <span>This field is required</span>}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Send</button>
            </form>

            <div>
                {messages.map((msg) => (
                    <div key={msg.id} className="border-b border-gray-200 p-4">
                        <div className="flex justify-between">
                            <span>{msg.user}</span>
                            <div>
                                <button onClick={() => dispatch(upvoteMessage({ messageId: msg.id }))}>
                                    👍 {msg.upvotes}
                                </button>
                                <button onClick={() => dispatch(downvoteMessage({ messageId: msg.id }))}>
                                    👎 {msg.downvotes}
                                </button>
                            </div>
                        </div>
                        <p>{msg.text}</p>
                        <Image
                            src={msg.picture}
                            alt={msg.user}
                            width={50}
                            height={50}
                        />
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const reply = e.target.reply.value;
                            handleReply(msg.id, reply);
                            e.target.reply.value = '';
                        }}>
                            <input name="reply" placeholder="Type your reply" className="border p-2 rounded w-full mb-2" />
                            <button type="submit" className="bg-green-500 text-white p-2 rounded">Reply</button>
                        </form>
                        {msg.replies && msg.replies.map((reply, index) => (
                            <div key={index} className="ml-4 border-l-2 border-gray-300 pl-2">
                                <div className="flex justify-between">
                                    <span>{reply.text}</span>
                                    <div>
                                        <button onClick={() => dispatch(upvoteMessage({ messageId: msg.id, replyIndex: index }))}>
                                            👍 {reply.upvotes || 0}
                                        </button>
                                        <button onClick={() => dispatch(downvoteMessage({ messageId: msg.id, replyIndex: index }))}>
                                            👎 {reply.downvotes || 0}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
