const SUPPORTED_AUDIO_EXTENSIONS = ["mp3", "wav", "ogg", "m4a", "aac", "flac", "webm"];

const demoTracks = [
  {
    id: "free-1",
    title: "Gymnopedie No. 1",
    artist: "Teknopazzo",
    album: "Free Library",
    duration: 205,
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Gymnopedie_No._1..ogg",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Gymnopedie_No._1..ogg",
    licenseName: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    rightsText: "Recording dedicated to the public domain (CC0).",
    filename: "Gymnopedie_No._1..ogg",
    addedAt: 1,
    coverSeed: "Gymnopedie No. 1"
  },
  {
    id: "free-2",
    title: "Moonlight Sonata",
    artist: "Ludwig van Beethoven",
    album: "Free Library",
    duration: 307,
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Moonlight_Sonata.ogg",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Moonlight_Sonata.ogg",
    licenseName: "Public Domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    rightsText: "Public-domain score/performance source as described on Wikimedia Commons.",
    filename: "Moonlight_Sonata.ogg",
    addedAt: 2,
    coverSeed: "Moonlight Sonata"
  },
  {
    id: "free-3",
    title: "Bach C Major Prelude",
    artist: "Robert Schroter",
    album: "Free Library",
    duration: 122,
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Bach_C_Major_Prelude_Equal.ogg",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bach_C_Major_Prelude_Equal.ogg",
    licenseName: "CC BY-SA / GFDL",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    rightsText: "Free to reuse with attribution and share-alike terms; see source page for full dual-license details.",
    filename: "Bach_C_Major_Prelude_Equal.ogg",
    addedAt: 3,
    coverSeed: "Bach C Major Prelude"
  },
  {
    id: "free-4",
    title: "In the Hall of the Mountain King",
    artist: "CambridgeBayWeather",
    album: "Free Library",
    duration: 176,
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/In_the_Hall_of_the_Mountain_King.ogg",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:In_the_Hall_of_the_Mountain_King.ogg",
    licenseName: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    rightsText: "Reusable with attribution and share-alike terms.",
    filename: "In_the_Hall_of_the_Mountain_King.ogg",
    addedAt: 4,
    coverSeed: "In the Hall of the Mountain King"
  },
  {
    id: "free-5",
    title: "Hungarian Rhapsody No. 2",
    artist: "U.S. Navy Band",
    album: "Free Library",
    duration: 545,
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hungarian_Rhapsody_No_2.ogg",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Hungarian_Rhapsody_No_2.ogg",
    licenseName: "Public Domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
    rightsText: "Public-domain composition and U.S. federal government performance.",
    filename: "Hungarian_Rhapsody_No_2.ogg",
    addedAt: 5,
    coverSeed: "Hungarian Rhapsody No. 2"
  },
  {
    id: "free-6",
    title: "Maple Leaf Rag",
    artist: "William J. Leslie",
    album: "Free Library",
    duration: 194,
    url: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Maple_Leaf_RagQ.ogg",
    source: "Wikimedia Commons",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Maple_Leaf_RagQ.ogg",
    licenseName: "CC BY-SA 2.5",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.5/",
    rightsText: "Reusable with attribution and share-alike terms.",
    filename: "Maple_Leaf_RagQ.ogg",
    addedAt: 6,
    coverSeed: "Maple Leaf Rag"
  }
];

const projectManifestPath = "./music/manifest.json";

const state = {
  tracks: [],
  filteredTracks: [],
  currentTrackIndex: -1,
  currentTrackId: null,
  searchTerm: "",
  sortMode: "title",
  isShuffle: false,
  repeatMode: "all",
  volume: 0.85
};

const fileInput = document.getElementById("file-input");
const folderInput = document.getElementById("folder-input");
const demoButton = document.getElementById("demo-button");
const audioPlayer = document.getElementById("audio-player");
const playButton = document.getElementById("play-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const shuffleButton = document.getElementById("shuffle-button");
const repeatButton = document.getElementById("repeat-button");
const volumeRange = document.getElementById("volume-range");
const progressRange = document.getElementById("progress-range");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const trackList = document.getElementById("track-list");
const songCount = document.getElementById("song-count");
const totalDuration = document.getElementById("total-duration");
const queueCount = document.getElementById("queue-count");
const modeLabel = document.getElementById("mode-label");
const currentTitle = document.getElementById("current-title");
const currentArtist = document.getElementById("current-artist");
const currentAlbum = document.getElementById("current-album");
const currentRights = document.getElementById("current-rights");
const currentTime = document.getElementById("current-time");
const durationTime = document.getElementById("duration-time");
const playbackBadge = document.getElementById("playback-badge");
const coverInitials = document.getElementById("cover-initials");
const coverArt = document.getElementById("cover-art");
const sourceLink = document.getElementById("source-link");
const licenseLink = document.getElementById("license-link");

audioPlayer.volume = state.volume;

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getFileExtension(name) {
  return String(name).split(".").pop().toLowerCase();
}

function isAudioFile(file) {
  if (file.type && file.type.startsWith("audio/")) {
    return true;
  }

  return SUPPORTED_AUDIO_EXTENSIONS.includes(getFileExtension(file.name));
}

function readDurationFromFile(file) {
  return new Promise((resolve) => {
    const probe = document.createElement("audio");
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      probe.src = "";
      URL.revokeObjectURL(objectUrl);
    };

    probe.preload = "metadata";
    probe.addEventListener(
      "loadedmetadata",
      () => {
        const duration = Number.isFinite(probe.duration) ? probe.duration : 0;
        cleanup();
        resolve(duration);
      },
      { once: true }
    );

    probe.addEventListener(
      "error",
      () => {
        cleanup();
        resolve(0);
      },
      { once: true }
    );

    probe.src = objectUrl;
  });
}

function revokeObjectUrls(tracks) {
  tracks.forEach((track) => {
    if (track.url && track.url.startsWith("blob:")) {
      URL.revokeObjectURL(track.url);
    }
  });
}

function buildDisplayTitle(filename) {
  return filename.replace(/\.[^/.]+$/, "").replace(/[_-]+/g, " ").trim();
}

function extractFolderSource(file) {
  if (file.webkitRelativePath) {
    const segments = file.webkitRelativePath.split("/");
    return segments.length > 1 ? segments.slice(0, -1).join(" / ") : "Imported folder";
  }

  return "Imported files";
}

function createColorSeed(input) {
  let hash = 0;

  for (const char of input) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

function updateCover(track) {
  const label = track ? `${track.title} ${track.artist}` : "PulsePlay";
  const seed = createColorSeed(label);
  const hueA = seed % 360;
  const hueB = (seed + 80) % 360;
  const hueC = (seed + 160) % 360;

  coverArt.style.background = `
    radial-gradient(circle at 26% 24%, rgba(255, 255, 255, 0.42), transparent 24%),
    linear-gradient(135deg, hsl(${hueA} 70% 48%), hsl(${hueB} 78% 66%) 48%, hsl(${hueC} 72% 40%) 100%)
  `;

  if (!track) {
    coverInitials.textContent = "PP";
    return;
  }

  const initials = `${track.title} ${track.artist}`
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  coverInitials.textContent = initials || "PP";
}

function updateModeLabel() {
  const repeatLabel = state.repeatMode === "one" ? "Repeat One" : "Repeat All";
  modeLabel.textContent = state.isShuffle ? `Shuffle + ${repeatLabel}` : repeatLabel;
}

function updateLibraryStats() {
  songCount.textContent = String(state.tracks.length);
  queueCount.textContent = String(state.filteredTracks.length);

  const totalSeconds = state.tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
  const totalMinutes = totalSeconds > 0 ? Math.round(totalSeconds / 60) : 0;
  totalDuration.textContent = `${totalMinutes} min`;

  updateModeLabel();
}

function compareTracks(a, b, mode) {
  if (mode === "artist") {
    return a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title);
  }

  if (mode === "duration") {
    return (a.duration || 0) - (b.duration || 0) || a.title.localeCompare(b.title);
  }

  if (mode === "recent") {
    return b.addedAt - a.addedAt;
  }

  return a.title.localeCompare(b.title);
}

function deriveFilteredTracks() {
  const normalizedSearch = state.searchTerm.trim().toLowerCase();

  state.filteredTracks = [...state.tracks]
    .filter((track) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [
        track.title,
        track.artist,
        track.album,
        track.source,
        track.filename
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    })
    .sort((left, right) => compareTracks(left, right, state.sortMode));

  updateLibraryStats();
}

function renderTrackList() {
  trackList.innerHTML = "";

  if (!state.filteredTracks.length) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "table-empty";
    emptyMessage.textContent =
      state.tracks.length === 0
        ? "No songs yet. Add audio files or a folder to build your music library."
        : "No songs match your current search.";
    trackList.appendChild(emptyMessage);
    return;
  }

  state.filteredTracks.forEach((track) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "track-row";
    row.dataset.trackId = track.id;

    if (track.id === state.currentTrackId) {
      row.classList.add("is-active");
    }

    row.innerHTML = `
      <span>
        <span class="track-title">${track.title}</span>
        <span class="track-subline">${track.filename}</span>
      </span>
      <span class="track-artist">${track.artist}</span>
      <span class="track-album">${track.album} | ${track.source}</span>
      <span class="track-duration">${formatTime(track.duration)}</span>
    `;

    row.addEventListener("click", () => {
      loadTrackById(track.id, true);
    });

    trackList.appendChild(row);
  });
}

function refreshLibrary() {
  deriveFilteredTracks();
  renderTrackList();
}

function getTrackById(trackId) {
  return state.tracks.find((track) => track.id === trackId) || null;
}

function syncCurrentTrackIndex() {
  state.currentTrackIndex = state.filteredTracks.findIndex((track) => track.id === state.currentTrackId);
}

function updateNowPlaying(track) {
  if (!track) {
    currentTitle.textContent = "No song selected";
    currentArtist.textContent = "Import songs to begin.";
    currentAlbum.textContent = "Album and file details appear here.";
    currentRights.textContent = "Rights info will appear here for built-in free tracks.";
    sourceLink.href = "#";
    sourceLink.setAttribute("aria-disabled", "true");
    licenseLink.href = "#";
    licenseLink.setAttribute("aria-disabled", "true");
    currentTime.textContent = "0:00";
    durationTime.textContent = "0:00";
    progressRange.value = "0";
    playbackBadge.textContent = "Idle";
    updateCover(null);
    return;
  }

  currentTitle.textContent = track.title;
  currentArtist.textContent = `${track.artist} | ${track.source}`;
  currentAlbum.textContent = `${track.album} | ${track.filename}`;
  currentRights.textContent = track.rightsText || "Imported local file.";
  sourceLink.href = track.sourceUrl || "#";
  sourceLink.setAttribute("aria-disabled", track.sourceUrl ? "false" : "true");
  licenseLink.href = track.licenseUrl || "#";
  licenseLink.setAttribute("aria-disabled", track.licenseUrl ? "false" : "true");
  sourceLink.textContent = track.sourceUrl ? "Source" : "Source N/A";
  licenseLink.textContent = track.licenseName || "License N/A";
  durationTime.textContent = formatTime(track.duration || audioPlayer.duration || 0);
  updateCover(track);
}

function loadTrackById(trackId, shouldPlay) {
  const track = getTrackById(trackId);

  if (!track) {
    return;
  }

  state.currentTrackId = track.id;
  syncCurrentTrackIndex();
  audioPlayer.src = track.url;
  updateNowPlaying(track);
  renderTrackList();

  if (shouldPlay) {
    audioPlayer.play().catch(() => {
      playbackBadge.textContent = "Ready";
    });
  }
}

function chooseNextTrackId(direction) {
  if (!state.filteredTracks.length) {
    return null;
  }

  if (state.isShuffle) {
    if (state.filteredTracks.length === 1) {
      return state.filteredTracks[0].id;
    }

    const candidates = state.filteredTracks.filter((track) => track.id !== state.currentTrackId);
    const randomTrack = candidates[Math.floor(Math.random() * candidates.length)];
    return randomTrack?.id || null;
  }

  syncCurrentTrackIndex();
  const fallbackIndex = state.currentTrackIndex >= 0 ? state.currentTrackIndex : 0;
  let nextIndex = fallbackIndex + direction;

  if (nextIndex < 0) {
    nextIndex = state.filteredTracks.length - 1;
  }

  if (nextIndex >= state.filteredTracks.length) {
    nextIndex = 0;
  }

  return state.filteredTracks[nextIndex]?.id || null;
}

function playNext(direction = 1) {
  if (!state.filteredTracks.length) {
    return;
  }

  const nextTrackId = chooseNextTrackId(direction);

  if (nextTrackId) {
    loadTrackById(nextTrackId, true);
  }
}

async function importTracks(fileList) {
  const files = Array.from(fileList).filter(isAudioFile);

  if (!files.length) {
    playbackBadge.textContent = "No audio files found";
    return;
  }

  playbackBadge.textContent = "Importing";

  const importedTracks = await Promise.all(
    files.map(async (file, index) => {
      const duration = await readDurationFromFile(file);
      const title = buildDisplayTitle(file.name);

      return {
        id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
        title,
        artist: "Unknown Artist",
        album: "Local Library",
        duration,
        url: URL.createObjectURL(file),
        source: extractFolderSource(file),
        sourceUrl: "",
        licenseName: "",
        licenseUrl: "",
        rightsText: "Imported from your laptop.",
        filename: file.name,
        addedAt: Date.now() + index,
        coverSeed: title
      };
    })
  );

  const knownIds = new Set(state.tracks.map((track) => track.id));
  const uniqueTracks = importedTracks.filter((track) => !knownIds.has(track.id));

  state.tracks = [...state.tracks, ...uniqueTracks];
  refreshLibrary();

  if (!state.currentTrackId && state.filteredTracks[0]) {
    loadTrackById(state.filteredTracks[0].id, false);
  }

  playbackBadge.textContent = `${uniqueTracks.length} song${uniqueTracks.length === 1 ? "" : "s"} added`;
}

function loadDemoTracks() {
  const existingDemoIds = new Set(state.tracks.map((track) => track.id));
  const nextTracks = demoTracks.filter((track) => !existingDemoIds.has(track.id));

  state.tracks = [...state.tracks, ...nextTracks];
  refreshLibrary();

  if (!state.currentTrackId && state.filteredTracks[0]) {
    loadTrackById(state.filteredTracks[0].id, false);
  }

  playbackBadge.textContent = "Demo tracks ready";
}

function normalizeManifestTrack(track, index) {
  const title = buildDisplayTitle(track.title || track.file || `Track ${index + 1}`);

  return {
    id: `manifest-${track.file || title}-${index}`,
    title,
    artist: track.artist || "Unknown Artist",
    album: track.album || "Project Library",
    duration: Number(track.duration) || 0,
    url: `./music/${track.file}`,
    source: track.source || "Project library",
    sourceUrl: track.sourceUrl || "",
    licenseName: track.licenseName || "",
    licenseUrl: track.licenseUrl || "",
    rightsText: track.rightsText || "Project library track.",
    filename: track.file || `${title}.mp3`,
    addedAt: track.addedAt || Date.now() + index,
    coverSeed: title
  };
}

function loadManifestTracks(tracks) {
  revokeObjectUrls(state.tracks);
  state.tracks = tracks.map(normalizeManifestTrack);
  refreshLibrary();

  if (state.filteredTracks[0]) {
    loadTrackById(state.filteredTracks[0].id, false);
  } else {
    updateNowPlaying(null);
  }

  playbackBadge.textContent = `${state.tracks.length} project song${state.tracks.length === 1 ? "" : "s"} loaded`;
}

async function tryLoadProjectLibrary() {
  try {
    const response = await fetch(projectManifestPath, { cache: "no-store" });

    if (!response.ok) {
      return;
    }

    const manifest = await response.json();

    if (!Array.isArray(manifest.tracks) || manifest.tracks.length === 0) {
      return;
    }

    loadManifestTracks(manifest.tracks);
  } catch (error) {
    const openedFromFileProtocol = window.location.protocol === "file:";

    if (openedFromFileProtocol) {
      playbackBadge.textContent = "Project library needs a local server";
    }
  }
}

fileInput.addEventListener("change", async (event) => {
  await importTracks(event.target.files);
  fileInput.value = "";
});

folderInput.addEventListener("change", async (event) => {
  await importTracks(event.target.files);
  folderInput.value = "";
});

demoButton.addEventListener("click", loadDemoTracks);

playButton.addEventListener("click", () => {
  if (!state.currentTrackId && state.filteredTracks[0]) {
    loadTrackById(state.filteredTracks[0].id, true);
    return;
  }

  if (!audioPlayer.src) {
    return;
  }

  if (audioPlayer.paused) {
    audioPlayer.play().catch(() => {
      playbackBadge.textContent = "Unable to play";
    });
  } else {
    audioPlayer.pause();
  }
});

previousButton.addEventListener("click", () => {
  playNext(-1);
});

nextButton.addEventListener("click", () => {
  playNext(1);
});

shuffleButton.addEventListener("click", () => {
  state.isShuffle = !state.isShuffle;
  shuffleButton.classList.toggle("is-active", state.isShuffle);
  shuffleButton.textContent = state.isShuffle ? "Shuffle On" : "Shuffle Off";
  updateModeLabel();
});

repeatButton.addEventListener("click", () => {
  state.repeatMode = state.repeatMode === "all" ? "one" : "all";
  repeatButton.classList.toggle("is-active", state.repeatMode === "one");
  repeatButton.textContent = state.repeatMode === "one" ? "Repeat One" : "Repeat All";
  updateModeLabel();
});

volumeRange.addEventListener("input", () => {
  state.volume = Number(volumeRange.value);
  audioPlayer.volume = state.volume;
});

progressRange.addEventListener("input", () => {
  if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) {
    return;
  }

  const nextTime = (Number(progressRange.value) / 100) * audioPlayer.duration;
  audioPlayer.currentTime = nextTime;
});

searchInput.addEventListener("input", () => {
  state.searchTerm = searchInput.value;
  refreshLibrary();
});

sortSelect.addEventListener("change", () => {
  state.sortMode = sortSelect.value;
  refreshLibrary();
});

audioPlayer.addEventListener("play", () => {
  playButton.textContent = "Pause";
  playbackBadge.textContent = "Playing";
});

audioPlayer.addEventListener("pause", () => {
  playButton.textContent = "Play";
  if (audioPlayer.currentTime > 0 && audioPlayer.currentTime < (audioPlayer.duration || Number.MAX_SAFE_INTEGER)) {
    playbackBadge.textContent = "Paused";
  }
});

audioPlayer.addEventListener("loadedmetadata", () => {
  const track = getTrackById(state.currentTrackId);

  if (track && (!track.duration || track.duration === 0) && Number.isFinite(audioPlayer.duration)) {
    track.duration = audioPlayer.duration;
    refreshLibrary();
  }

  durationTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("timeupdate", () => {
  if (!Number.isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) {
    progressRange.value = "0";
    currentTime.textContent = "0:00";
    return;
  }

  const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressRange.value = String(percentage);
  currentTime.textContent = formatTime(audioPlayer.currentTime);
  durationTime.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("ended", () => {
  if (state.repeatMode === "one") {
    audioPlayer.currentTime = 0;
    audioPlayer.play().catch(() => {
      playbackBadge.textContent = "Ready";
    });
    return;
  }

  playNext(1);
});

audioPlayer.addEventListener("error", () => {
  playbackBadge.textContent = "Playback error";
});

updateNowPlaying(null);
refreshLibrary();
updateCover(null);
loadDemoTracks();
tryLoadProjectLibrary();
