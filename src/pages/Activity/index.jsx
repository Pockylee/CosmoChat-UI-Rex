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
    
    
}