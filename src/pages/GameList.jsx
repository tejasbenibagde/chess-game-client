// src/components/GameList.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesByUserId } from "../actions/gameActions";
import { useParams } from "react-router-dom";

const GameList = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { gamesByUser, loading, error } = useSelector((state) => state.game);
    const games = gamesByUser[id] || [];

    useEffect(() => {
        if (!games.length) {
            dispatch(fetchGamesByUserId(id));
        }
    }, [dispatch, id, games.length]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>Game History</h1>
            <ul>
                {games.map((game) => (
                    <li key={game.id}>
                        Game {game.id}: {game.result}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GameList;
