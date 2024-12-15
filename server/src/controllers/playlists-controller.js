import express from "express";
import asyncHandler from "express-async-handler";
import playlistsData from "../data/playlists.js";
import playlistServices from "../service/playlist-services.js";
import { authMiddleware } from "../auth/auth-middleware.js";

const playlistsController = express.Router();

playlistsController
  // Get all playlists
  .get(
    "/",
    asyncHandler(async (req, res) => {
      const thePlaylists = await playlistsData.getAllPlaylists();
      res.json(thePlaylists);
    })
  )

  // Generate playlist
  .post(
    "/",
    authMiddleware,
    asyncHandler(async (req, res) => {
      const playlist = await playlistServices.playlistGenerator(req);
      res.status(201).json(playlist);
    })
  )

  // Get a playlist
  .get(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const playlist = await playlistsData.getTracksForPlaylistById(id);
      const filteredPlaylist = playlist.filter((t) =>
        t.hasOwnProperty("track_id")
      );
      res.json(filteredPlaylist);
    })
  )

  // Delete playlist
  .delete(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const isDeleted = await playlistsData.deletePlaylist(id);
      if (isDeleted) {
        return res.status(204).end();
      }
      res.status(404).json({ error: "Playlist deletion failed" });
    })
  )

  // Update playlist
  .patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      const playlistUpdated = await playlistServices.updatePlaylist(
        id,
        updateData
      );
      if (playlistUpdated) {
        const newPlaylist = await playlistsData.getPlaylistById(id);
        res.status(200).json(newPlaylist[0]);
      } else {
        res.status(404).json({ error: "Playlist update failed" });
      }
    })
  );

export default playlistsController;
