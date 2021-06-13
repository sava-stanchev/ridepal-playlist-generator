import express from 'express';
import playlistsData from '../data/playlists.js';
import playlistServices from '../service/playlist-services.js';

const playlistsController = express.Router();

playlistsController

    .get('/', async (req, res) => {
      try {
        const thePlaylists = await playlistsData.getAllPlaylists();
        res.json(thePlaylists);
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    })

    .get('/:id', async (req, res) => {
      try {
        const playlistId = +req.params.id;
        const playlist = await playlistsData.getTracksForPlaylistById(playlistId);
        const filteredPlaylist = playlist.filter((t) => t.hasOwnProperty('playlist_name'));
        // console.log(filteredPlaylist);
        res.json(filteredPlaylist);
      } catch (error) {
        return res.status(404).json({
          error: error.message,
        });
      }
    })

    .delete('/:id', async (req, res) => {
      try {
        const playlist = await playlistsData.getPlaylistById(+req.params.id);
        if (!playlist || playlist.is_deleted === 1) {
          return res.status(400).json({
            message: 'Playlist not found!',
          });
        }
        await playlistsData.deletePlaylist(+req.params.id);
        res.status(200).send(playlist);
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    })

    .patch('/:id', async (req, res) => {
      const playlistId = req.params.id;
      const updateData = req.body;
      try {
        const playlist = await playlistsData.getPlaylistById(+playlistId);
        if (!playlist) {
          res.status(404).send({
            message: 'Playlist not found!',
          });
        }

        const playlistUpdated = await playlistServices.updatePlaylist(+playlistId, updateData);
        const newPlaylist = await playlistsData.getPlaylistById(+playlistId);
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
