import { h, Component } from 'preact';
import {botman} from './../botman';
import MessageType from "./messagetype";
import { IMessageTypeProps, IAction, IMessage } from '../../typings';

export default class Action extends MessageType {

    render(props: IMessageTypeProps) {
        const message = props.message;

        const buttons = message.actions.map((action: IAction) => {
            return <div class="btn" onClick={() => this.handleClick(action)}>
                {action.text}
            </div>;
        });

        return (
            <div>
                {message.text && <div>{message.text}</div>}
                {this.state.attachmentsVisible ?
                    <div>{buttons}</div>
                    : ''}
            </div>
        );
    }

    showMessage(action: IAction) {
        botman.callAPI(action.value, true, null, (msg: IMessage) => {
            this.props.messageHandler({
                text: action.text,
                type: msg.type,
                timeout: msg.timeout,
                actions: null,
                attachment: null,
                additionalParameters: null,
                from: 'visitor'
            });
        }, null);
    }
    
    performAction(action: IAction) {
        botman.callAPI(action.value, true, null, (msg: IMessage) => {
            this.setState({attachmentsVisible : false });
            this.props.messageHandler({
                text: msg.text,
                type: msg.type,
                timeout: msg.timeout,
                actions: msg.actions,
                attachment: msg.attachment,
                additionalParameters: msg.additionalParameters,
                from: 'chatbot'
            });
        }, null);
        
    }

    handleClick(action: IAction){
        this.showMessage(action);
        this.performAction(action);
    }

    
}
