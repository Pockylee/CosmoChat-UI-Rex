import React, { useEffect, useState} from "react";
import { Button, Grid } from "@mui/material";
import Textarea from "@mui/material";
import Images from "../../constants/images";
import ChatStyles from "../../styles/chat";
import RexMessage from "../../components/RexMessage";
import api from "../../api/sessions";
import OpenAI from "openai";
import { useParams } from "react-router-dom";
import UseMessage from "../../components/UserMessage";
import useMediaQuery from "@mui/material/useMediaQuery";

const Chat = () => {
    const { id } = useParams();
    const [userPrompt, setUserPrompt] = useState("");
    const [reXReply, setReXReply] = useState("");
    const [sessions, setSessions] = useState([]);
    const [thisSession, setThisSession] = useState({});
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
    const openai = new OpenAI({ apiKey: API_KEY, dangerouslyAllowBrowser: true });
    const matches = useMediaQuery("(max-width: 600px)");
    let chatKeys = [];

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get("/sessions");
                setSessions(response.data);
                setThisSession(
                    response.data.find(
                        (session) => parseInt(session?.id, 10) == parseInt(id, 10)
                    )
                );
                handleScroll();
                window.addEventListener("scroll", handleScroll);
            } catch (err) {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else {
                    console.log(err);
                }
            }
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        };
        fetchSessions();
    }, []);

    const handleScroll = () => {
        const scrollPostion = window.scrollY;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let updatedSession = {};
        
        setTimeout(async function () {
            const date = new Date();
            const month = month = date.getMonth();
            const day = getDate();
            const year = date.getFullYear();
            const formattedDate = months[month] + " " + day + ", " + year;
            callOpenAIAPI();
            thisSession.chats.push({user: userPrompt, Rex: reXReply });
            updatedSession = {
                id: id,
                date: formattedDate,
                chats: thisSession.chats,
                isSessionEnded: thisSesssion.isSessionEnded,
            };
            for (let i=0; i < updatedSession.chats.length; i++) {
                chatKeys.push(Object.keys(updatedSession.chats[i]));
            }

            try {
                const response = await api.patch(`/sessions/${id}`, updatedSession);
                setSessions(
                    sessions.map((session) =>
                        session.id === id ? response.data : session
                    )
                );
                setUserPrompt("");
            } catch (err) {
                console.log(`Error: ${err.message}`);
            }
        }, 5000);
    };

    async function callOpenAIAPI() {
        const completion = await openai.chat.completetions.craete({
            messages: [
                {
                    role: "system",
                    content: "Your name is ReX, You are a areer advice assistant. You give adcive to Andrew about his career."
                },
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 100,
        });

        setReXReply(completion.choices[0].message.content);
    }

    return (
        <Grid container style={{ display: matches ? "none" : "black" }}>
          <Grid style={{ padding: "40px 24px 24px 24px", positions: "sticky" }}>
            <img src={Images.HomRex} alt="Rex" style={{ width: "105px" }} />
          </Grid>
          <Grid {...ChatStyles.textDisplayBackground}>
            {ThisSessions?.chats?.map((chat, i) =>
              Object.keys(chat).map((key) => key === "Rex" ? (
                <RexMessage rexMessage = {chat.Rex} key = {"rex" + i} />
              ):(
                <UserMessage userMessage = {chat.user} key = {"user" + i} />
              ))
            )}
          </Grid>
          {ThisSessions && !ThisSessions.isSessionEnded ? (
            <Grid>
              <Textarea 
              {...ChatStyles.textArea} 
              name = "Soft"    
              placeholder ="Soft"
              variant ="soft"
              onChange ={(e)=> setUserPrompt(e.target.value)}      
              
              />
              </Grid>
          ): null}
        </Grid>
      );
};

export default Chat;