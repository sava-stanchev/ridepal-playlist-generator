import express from "express";
import playlistsData from "../data/playlists.js";
import playlistServices from "../service/playlist-services.js";
import { authMiddleware } from "../auth/auth-middleware.js";

const playlistsController = express.Router();

playlistsController

  .get("/", async (req, res) => {
    try {
      const thePlaylists = await playlistsData.getAllPlaylists();
      res.json(thePlaylists);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  .post("/", authMiddleware, async (req, res) => {
    try {
      const playlist = await playlistServices.playlistGenerator(req);
      res.status(200).send(playlist);
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  .get("/:id", async (req, res) => {
    try {
      const playlistId = +req.params.id;
      const playlist = await playlistsData.getTracksForPlaylistById(playlistId);
      const filteredPlaylist = playlist.filter((t) =>
        t.hasOwnProperty("track_id")
      );
      res.json(filteredPlaylist);
    } catch (error) {
      return res.status(404).json({
        error: error.message,
      });
    }
  })

  .delete("/:id", async (req, res) => {
    try {
      await playlistsData.deletePlaylist(req.params.id);
      res.end();
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  })

  .patch("/:id", async (req, res) => {
    try {
      const playlistId = req.params.id;
      const updateData = req.body;

      const playlistUpdated = await playlistServices.updatePlaylist(
        playlistId,
        updateData
      );
      const newPlaylist = await playlistsData.getPlaylistById(playlistId);
      if (playlistUpdated) {
        res.status(200).send(newPlaylist[0]);
      }
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });

export default playlistsController;
