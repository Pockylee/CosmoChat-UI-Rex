import React, { useEffect, useState } from "react";
import api from "../../api/sessions";
import { Grid, CircularProgress, Typography, Link } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import ActivityStyle from "../../styles/activity"; 
import Allstyle from "../../styles/all";
import ChatHistory from "../../components/ChatHistory";

const Activity = () => {
    const [loading, setLoading] = useState(true);
    const [sessionDates, setSessionDates] = useState([]);
    const [sessionChatLengths, setSessionChatLengths] = useState([]);
    const [sessions, setSessions] = useState([]);
    
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await api.get("/sessions");
                setSessions(response.data.reverse());
                setSessionDates(
                    [...Array.from(response.data, (data) => data.date.split(",")[0])]
                )
                setSessionChatLengths(
                    [...Array.from(response.data, (data) => data.chats.length)]
                )
                setLoading(false);
            } catch (err) {
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                } else {
                    console.log(err);
                }
            }
        };
        fetchSessions();
    }, []);
    return (
        <Grid container className={ActivityStyles.activityBody}>
          <Grid container item className={ActivityStyles.titleOutline}>
            <Typography className={ActivityStyles.title}>Your Statistics</Typography>
          </Grid>
          <Grid container item>
            <Typography className={ActivityStyles.description}>
              Graph of the conversation you had with ReX this year.
            </Typography>
          </Grid>
          <Grid container item>
            {loading ? (
              <CircularProgress />
            ) : (
              <BarChart
                xAxis={{ scaleType: "band", data: sessionDates }}
                series={[{ data: sessionChatLengths }]}
                width={500}
                height={300}
              />
            )}
          </Grid>
          <Grid container item className={AllStyles.endedChatsTitle}>
            <Grid className={AllStyles.endedChats}>Details Chat Activity</Grid>
            <Link className={AllStyles.seeAllLink} href="/activityDetails">
              See All
            </Link>
          </Grid>
          <Grid container item>
            {loading ? <CircularProgress /> : <ChatHistory sessions={sessions} />}
          </Grid>
        </Grid>
      );
};

export default Activity;