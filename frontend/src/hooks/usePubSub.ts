//@ts-ignore
import pubsub from 'pubsub-js'

type SubscribeCallBack = (message: string, data: any) => void
type Message = 'post' | 'switch'
interface PubSub {
    
    publish: (message: Message, data: any) => void;

    subscribe: (message: Message, cb: SubscribeCallBack ) => void

    clearAllSubscriptions: () => void

    clearSubscriptions: (message: Message) => void

    unsubscribe: (message: Message ) => void;
}


export const usePubSub = (): PubSub => pubsub


