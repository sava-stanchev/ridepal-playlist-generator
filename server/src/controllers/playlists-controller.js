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
      return res.json(thePlaylists);
    })
  )

  // Generate playlist
  .post(
    "/",
    authMiddleware,
    asyncHandler(async (req, res) => {
      const playlist = await playlistServices.playlistGenerator(req);
      return res.status(201).json(playlist);
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
      await playlistsData.deletePlaylist(id);
      return res.status(204).end();
    })
  )

  // Update playlist
  .patch(
    "/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;

      await playlistServices.updatePlaylist(id, updateData);
      const newPlaylist = await playlistsData.getPlaylistById(id);
      return res.status(200).json(newPlaylist[0]);
    })
  );

export default playlistsController;
