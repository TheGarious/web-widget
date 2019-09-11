import { h, Component } from "preact";
import MessageArea from "./message-area";
import { botman } from "./botman";
import {IMessage, IConfiguration} from "../typings";

export default class Chat extends Component<IChatProps, IChatState> {

    styleMessageArea = {
        backgoundColor: "blue",
    };

    [key: string]: any
    botman: any;
    input: HTMLInputElement;
    textarea: HTMLInputElement;

    constructor(props: IChatProps) {
        super(props);

        this.botman = botman;
        this.botman.setUserId(this.props.userId);
        this.botman.setChatServer(this.props.conf.chatServer);
        this.setState({ messages : [] });
        this.setState({ replyType : ReplyType.Text });
    }

    options = { year: 'numeric', month: 'long', day: 'numeric'};
    date = new Date().toLocaleDateString("fr-FR", this.options).toLocaleUpperCase()

    componentDidMount() {
        if (!this.state.messages.length && this.props.conf.introMessage) {
            this.writeToMessages({
                text: this.props.conf.introMessage,
                type: "text",
                from: "chatbot"
            });
        }
        // Add event listener for widget API
        window.addEventListener("message", (event: MessageEvent) => {
            try {
                this[event.data.method](...event.data.params);
            } catch (e) {
                //
            }
        });
    }

    sayAsBot(text: string) {
        this.writeToMessages({
            text,
            type: "text",
            from: "chatbot"
        });
    }

    say(text: string, showMessage = true) {
        const message: IMessage = {
            text,
            type: "text",
            from: "visitor"
        };

        // Send a message from the html user to the server
        this.botman.callAPI(message.text, false, null, (msg: IMessage) => {
            msg.from = "chatbot";
            this.writeToMessages(msg);
        });

        if (showMessage) {
            this.writeToMessages(message);
        }
    }

    whisper(text: string) {
        this.say(text, false);
    }

    render({}, state: IChatState) {
        return (
            <div>
                <div id="messageArea" style={this.styleMessageArea}>
                    <div class="intro">
                        <div class="intro__picture">
                            <div className="imagejustement"></div>
                        </div>
                        <div class="intro__text">
                            <h2>{this.props.conf.introTitle}</h2>
                            <p>{this.props.conf.introPara}</p>
                        </div>  
                    </div>
                    <div class="intro__date">{this.date}</div>
                    <MessageArea
                        messages={state.messages}
                        conf={this.props.conf}
                        messageHandler={this.writeToMessages}
                    />
                </div>

                {this.state.replyType === ReplyType.Text ? (
                    <div style="position: relative">
                        <input
                            id="userText"
                            class="textarea"
                            type="text"
                            placeholder={this.props.conf.placeholderText}
                            ref={input => {
                                this.input = input as HTMLInputElement;
                            }}
                            onKeyPress={this.handleKeyPress}
                            autofocus 
                            />
                            <button 
                                style="position: absolute; height: 30px; left: 85%; top: 12px; 
                                z-index:1000; border: none; cursor: pointer; background: none;" 
                                onClick={this.handleClick}>
                                <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    id="paperplane"
                                    viewBox="0 0 60.062 60.062" 
                                    style="enable-background:new 0 0 60.062 60.062;height: 25px"
                                    >
                                    <path d="M60.046,11.196c0.004-0.024,0.011-0.048,0.013-0.072c0.007-0.074-0.001-0.149-0.01-0.224
                                        c-0.002-0.019,0.001-0.037-0.002-0.056c-0.018-0.099-0.051-0.196-0.1-0.289c-0.008-0.016-0.019-0.031-0.028-0.047
                                        c-0.002-0.002-0.002-0.005-0.003-0.008c-0.001-0.002-0.004-0.003-0.005-0.006c-0.007-0.011-0.013-0.023-0.02-0.033
                                        c-0.062-0.091-0.137-0.166-0.221-0.23c-0.019-0.014-0.041-0.022-0.061-0.035c-0.074-0.049-0.152-0.089-0.236-0.116
                                        c-0.037-0.012-0.074-0.018-0.112-0.025c-0.073-0.015-0.146-0.022-0.222-0.02c-0.04,0.001-0.078,0.003-0.118,0.009
                                        c-0.026,0.004-0.051,0-0.077,0.006L0.798,22.046c-0.413,0.086-0.729,0.421-0.788,0.839s0.15,0.828,0.523,1.025l16.632,8.773
                                        l2.917,16.187c-0.002,0.012,0.001,0.025,0,0.037c-0.01,0.08-0.011,0.158-0.001,0.237c0.005,0.04,0.01,0.078,0.02,0.117
                                        c0.023,0.095,0.06,0.184,0.11,0.268c0.01,0.016,0.01,0.035,0.021,0.051c0.003,0.005,0.008,0.009,0.012,0.013
                                        c0.013,0.019,0.031,0.034,0.046,0.053c0.047,0.058,0.096,0.111,0.152,0.156c0.009,0.007,0.015,0.018,0.025,0.025
                                        c0.015,0.011,0.032,0.014,0.047,0.024c0.061,0.04,0.124,0.073,0.191,0.099c0.027,0.01,0.052,0.022,0.08,0.03
                                        c0.09,0.026,0.183,0.044,0.277,0.044c0.001,0,0.002,0,0.003,0h0c0,0,0,0,0,0c0.004,0,0.008-0.002,0.012-0.002
                                        c0.017,0.001,0.034,0.002,0.051,0.002c0.277,0,0.527-0.124,0.712-0.315l11.079-7.386l11.6,7.54c0.164,0.106,0.354,0.161,0.545,0.161
                                        c0.105,0,0.212-0.017,0.315-0.051c0.288-0.096,0.518-0.318,0.623-0.604l13.996-37.989c0.013-0.034,0.024-0.069,0.033-0.105
                                        c0.004-0.015,0.005-0.03,0.008-0.044C60.042,11.22,60.044,11.208,60.046,11.196z M48.464,17.579L24.471,35.22
                                        c-0.039,0.029-0.07,0.065-0.104,0.099c-0.013,0.012-0.026,0.022-0.037,0.035c-0.021,0.023-0.04,0.046-0.059,0.071
                                        c-0.018,0.024-0.032,0.049-0.048,0.074c-0.037,0.06-0.068,0.122-0.092,0.188c-0.005,0.013-0.013,0.023-0.017,0.036
                                        c-0.001,0.004-0.005,0.006-0.006,0.01l-2.75,8.937l-2.179-12.091L48.464,17.579z M22.908,46.594l2.726-9.004l4.244,2.759
                                        l1.214,0.789l-4.124,2.749L22.908,46.594z M52.044,13.498L18.071,30.899l-14.14-7.458L52.044,13.498z M44.559,47.504L29.154,37.492
                                        l-2.333-1.517l30.154-22.172L44.559,47.504z"/>
                                </svg>
                        </button>
                    </div>
                ) : ''}

                {this.state.replyType === ReplyType.TextArea ? (
                    <div>

                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                             onClick={this.handleSendClick}
                             viewBox="0 0 535.5 535.5">
                            <g>
                                <g id="send">
                                    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75"/>
                                </g>
                            </g>
                        </svg>

                        <textarea
                            id="userText"
                            class="textarea"
                            placeholder={this.props.conf.placeholderText}
                            ref={input => {
                                this.textarea = input as HTMLInputElement;
                            }}
                            autofocus
                        />
                    </div>
                ) : ''}

                <a class="banner" href={this.props.conf.aboutLink} target="_blank">
                    {this.props.conf.aboutText === "AboutIcon" ? (
                        <svg
                            style="position: absolute; width: 14px; bottom: 6px; right: 6px;"
                            fill="#EEEEEE"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 1536 1792"
                        >
                            <path d="M1024 1376v-160q0-14-9-23t-23-9h-96v-512q0-14-9-23t-23-9h-320q-14 0-23 9t-9 23v160q0 14 9 23t23 9h96v320h-96q-14 0-23 9t-9 23v160q0 14 9 23t23 9h448q14 0 23-9t9-23zm-128-896v-160q0-14-9-23t-23-9h-192q-14 0-23 9t-9 23v160q0 14 9 23t23 9h192q14 0 23-9t9-23zm640 416q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                        </svg>
                    ) : (
                        this.props.conf.aboutText
                    )}
                </a>
            </div>
        );
    }

    handleClick = () => {
        if (this.input.value.replace(/\s/g, "")){
            this.say(this.input.value);

            // Reset input value
            this.input.value = "";
        }
    }

    handleKeyPress = (e: KeyboardEvent) => {
        if (e.keyCode === 13 && this.input.value.replace(/\s/g, "")) {
            this.say(this.input.value);

            // Reset input value
            this.input.value = "";
        }
    };

    handleSendClick = (e: MouseEvent) => {
        this.say(this.textarea.value);

        // Reset input value
        this.textarea.value = "";
    };

    static generateUuid() {
        let uuid = '', ii;
        for (ii = 0; ii < 32; ii += 1) {
            switch (ii) {
                case 8:
                case 20:
                    uuid += '-';
                    uuid += (Math.random() * 16 | 0).toString(16);
                    break;
                case 12:
                    uuid += '-';
                    uuid += '4';
                    break;
                case 16:
                    uuid += '-';
                    uuid += (Math.random() * 4 | 8).toString(16);
                    break;
                default:
                    uuid += (Math.random() * 16 | 0).toString(16);
            }
        }
        return uuid;
    }

	writeToMessages = (msg: IMessage) => {
        if (typeof msg.time === "undefined") {
            msg.time = new Date().toJSON();
        }
        if (typeof msg.visible === "undefined") {
            msg.visible = false;
        }
        if (typeof msg.timeout === "undefined") {
            msg.timeout = 0;
        }
        if (typeof msg.id === "undefined") {
            msg.id = Chat.generateUuid();
        }

	    if (msg.attachment === null) {
	        msg.attachment = {}; // TODO: This renders IAttachment useless
	    }

	    this.state.messages.push(msg);
	    this.setState({
	        messages: this.state.messages
	    });

	    if (msg.additionalParameters && msg.additionalParameters.replyType) {
	        this.setState({
                replyType: msg.additionalParameters.replyType
            });
        }
	};
}

interface IChatProps {
    userId: string,
    conf: IConfiguration
}

enum ReplyType {
    Text = "text",

    TextArea = "textarea"
}

interface IChatState {
    messages: IMessage[],

    replyType: string,
}
