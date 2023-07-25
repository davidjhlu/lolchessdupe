import React, { useState } from 'react';
import axios from 'axios';
export const Profile = () => {
    
    const [searchProfile, setSearchProfile] = useState("");
    const [playerData, setPlayerData] = useState([]);
    const [playerPuuid, setPlayerPuuid] = useState("");
    const [recentMatches, setRecentMatches] = useState([]);
    const [matchData, setMatchData] = useState([]);
    const [summonerFound, setSummonerFound] = useState(true);
    const API_KEY = ""; // put riot api key here
    
    const handleChange = (e) => {
        setSearchProfile(e.target.value);q
    };

    const getHistory = async (puuid) => {
        var matchHist = "https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/" + puuid + "/ids?api_key=" + API_KEY;
        try{
            const response = await axios.get(matchHist);
            setRecentMatches(response.data);
            setPlayerPuuid(puuid);
        } catch (error) {
            console.log(error);
        }
        
        // axios.get(matchHist).then(response => {
        //     setRecentMatches(response.data);
        // }).catch(error => {
        //     console.log(error);
        // });
    }

    const summonerSearch = async () => {
        var img = document.getElementById("summonerIcon");
        img.style.display = "block";

        // var level = document.getElementById("summonerLevel");
        // level.style.display = "block";

        var APICall = "https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/" + searchProfile + "?api_key=" + API_KEY;

        try{
            const response = await axios.get(APICall);
            setPlayerData(response.data);
            getHistory(response.data.puuid);
        } catch (error) {
            setSummonerFound(false);
            console.log(error);
        }


        // axios.get(APICall).then(response => {
        //     setPlayerData(response.data);
        //     setPlayerPuuid(response.data.puuid);
        // }).catch(error => {
        //     console.log(error);
        // });
    };

    const getSummoner = async (puuid) => {
        var getName = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-puuid/" + puuid + "?api_key=" + API_KEY;
        try{
            const response = await axios.get(getName);
            console.log(response.data.gameName);
            return response.data.gameName;
        } catch (error) {
            console.log(error);
        }

        
        // axios.get(matchHist).then(response => {
        //     setRecentMatches(response.data);
        // }).catch(error => {
        //     console.log(error);
        // });
    }
    

    const getMatches = async () => {
        console.log(recentMatches);
        //try this code block later
        try{
            const getMatch = await Promise.all(
                recentMatches.map(async (recentMatch) => {
                    var shouldwork = "https://americas.api.riotgames.com/tft/match/v1/matches/" + recentMatch + "?api_key=" + API_KEY;
                    const response = await axios.get(shouldwork);
                    // console.log(response.data);
                    setMatchData(prevData => [...prevData, response.data]);
                    return await response.data;
                })
            );
        } catch (error) {
            console.log(error);
        }
        
        // var APICall = "https://americas.api.riotgames.com/tft/match/v1/matches/" + recentMatches[0] + "/ids?api_key=" + API_KEY;
        // var shouldwork = "https://americas.api.riotgames.com/tft/match/v1/matches/NA1_4714727182?api_key=" + API_KEY;
        // try{
        //     const response = await axios.get(APICall);
        //     console.log(response);
        // } catch (error) {
        //     console.log(error);
        // }
    }
    // var match = "https://americas.api.riotgames.com/tft/match/v1/matches/"
    
    const badUnits = ["HeimerdingerTurret", "THex", "RyzeBandleCity", "RyzeDemacia", "RyzeFreljord", "RyzeIonia", "RyzeNoxus", "RyzePiltover", "RyzeShadowIsles", "RyzeShurima", "RyzeTargon", "RyzeZaun"]

    return (
        <div className="container">
            <h1>Search for TFT Profile</h1>
            <input type="text" onChange={handleChange}></input>
            {/* <button onClick={e => {
                handleClick(e);
                setTimeout(() => getHistory(e), 10000);
            }}>Search</button> */}
            <button onClick={e => summonerSearch(e)}>Search</button>
            {/* <button onClick={e => getHistory(e)}>Load Matches</button> */}
            <button onClick={e => getMatches(e)}>Get Matches</button>
            
            {summonerFound ? 
                <>
                    <p>{playerData.name}</p> 
                    <img id="summonerIcon" style={{display:'none'}} class="center" width="100" height="100" src={"http://ddragon.leagueoflegends.com/cdn/13.13.1/img/profileicon/" + playerData?.profileIconId + ".png"}></img>
                    {/* <p id="summonerLevel" style={{display:'none'}}>Summoner Level: {playerData?.summonerLevel}</p> */}
                </>
                :
                <><p>Summoner wasn't found.</p></>
            }
            {matchData.map((data, index) => (
                <div key={index}>
                    <h2></h2>
                    {data.info.participants.map((participant) => (
                        (participant.puuid == playerPuuid) ?
                            <div align="center">
                                <p>placement: {participant.placement}</p>
                                <p>level: {participant.level}</p>
                                <p>gold left: {participant.gold_left}</p>
                                <p>augments: {participant.augments.join(' ')}</p>
                                <div style={{ display: 'flex', justifyContent: 'center'}}>
                                    {participant.units.map((unit, index1) => {
                                        const noPrefix = unit.character_id.replace(/^TFT9_|^tft9_/, '')
                                        const showImage = !badUnits.includes(noPrefix)
                                        const restOfName = noPrefix.slice(1).toLowerCase();
                                        const isRyze = (noPrefix.slice(0,4) == "Ryze");
                                        var formattedName;
                                        if(noPrefix == "JarvanIV" ){
                                            formattedName = noPrefix;
                                        }else if(noPrefix == "reksai"){
                                            formattedName = "RekSai";
                                        }else if(noPrefix == "Ksante" || noPrefix == "KSante"){
                                            formattedName = "KSante";
                                        }else{
                                            formattedName = noPrefix.charAt(0) + restOfName;
                                        }
                                        return(
                                            <div style={{marginRight: '5px'}}>
                                                {showImage && 
                                                (<img
                                                    id="champicon" class="center" width="40" height="40" 
                                                    src={"http://ddragon.leagueoflegends.com/cdn/13.13.1/img/champion/" + formattedName + ".png"}>
                                                </img>)}
                                                {isRyze && 
                                                (<img
                                                    id="champicon" class="center" width="40" height="40" 
                                                    src={"http://ddragon.leagueoflegends.com/cdn/13.13.1/img/champion/Ryze.png"}>
                                                </img>)}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        :
                        (null)
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Profile;