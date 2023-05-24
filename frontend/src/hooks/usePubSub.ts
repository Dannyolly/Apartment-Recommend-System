//@ts-ignore
import pubsub from 'pubsub-js'

type SubscribeCallBack<Data> = (message: string, data: Data) => void
type Message = 'post' | 'switch' | 'perference'
interface PubSub<T, D = string> {

    publish: (message: Message | T, data: D) => void;

    subscribe: (message: Message | T, cb: SubscribeCallBack<D>) => void

    clearAllSubscriptions: () => void

    clearSubscriptions: (message: Message) => void

    unsubscribe: (message: Message) => void;
}



export function usePubSub<T extends Message>(): PubSub<T> {
    return pubsub;
}



// export const usePubSub = () : PubSub => pubsub


