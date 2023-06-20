import Echo from 'laravel-echo'
import Pusher, { type Options } from 'pusher-js'
import BaseService from './BaseService'
import type PrivateChannel from 'pusher-js/types/src/core/channels/private_channel';

// @ts-ignore:next-line
window.Pusher = Pusher;
 
class OrderService extends BaseService {
    private echo: Echo

    constructor(url?: string, broadcastHost: string = '127.0.0.1') {
        super(url)

        this.echo = new Echo({
            broadcaster: 'pusher',
            key: 'app-key',
            wsHost: broadcastHost,
            wsPort:6001,
            wssPort: 6001,
            forceTLS: false,
            encrypted: true,
            disableStats: true,
            cluster: 'mt1',
            enabledTransports: ['ws', 'wss'],

            authorizer: (channel: PrivateChannel, options: Options) => {

                return {
                    authorize: (socketId: number, callback: (p: any, p2?: any) => void) => {
                        this.axios.post(this.baseUrl + options.authEndpoint, {
                            socket_id: socketId,
                            channel_name: channel.name
                        })
                        .then(response => {
                            callback(null, response.data);
                        })
                        .catch(error => {
                            callback(error);
                        });
                    }
                };
            },
        })
    }

    public connectChannel(channel: string) {
        return this.echo.channel(channel)
    }

    public connectPrivateChannel(channel: string) {
        return this.echo.private(channel)
    }

    public leaveChannel(channel: string) {
        return this.echo.leaveChannel(channel)
    }

    public leaveAllChannels() {
        return this.echo.leaveAllChannels()
    }
}

export default OrderService