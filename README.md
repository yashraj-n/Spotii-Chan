<h1 align="center">
	<img
		width="300"
		alt="The Lounge"
		src="./assets/logo.png">
        <p>Spotii-Chan</p>
</h1>

<h3 align="center">
	Download Spotify Songs from YouTube in one Click
</h3>
<p align="center">
	<strong>
		<a href="https://github.com/yashraj-n/Spotii-Chan/releases">Releases</a>
	
</p>
<p align="center">
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/yashraj-n/Spotii-Chan?style=for-the-badge">
<img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/yashraj-n/Spotii-chan/Release?style=for-the-badge">
</p>

<p align="center">
	<img src="./assets/search_demo.png" width="550">
</p>

## Overview

- **Download Spotify Songs**. Search the desired song on Spotii-Chan and download it in one click.

- **Uses Invidious**. Spotii-Chan uses [Invidious](https://invidious.io/) to download the songs from YouTube.

- **No Ads**. Spotii-Chan is completely ad-free.

- **Reverse Song Lookup**. Spotii-Chan can use download songs from YouTube URL or Spotify URI.

- **Open Source**. Spotii-Chan is completely open source made in Tauri and written in Rust.

Scroll to the bottom for more screenshots.

## Installation and usage

Head over to the [releases](https://github.com/yashraj-n/Spotii-Chan/releases) page and download the latest version for your operating system.

## Building from source

Spotii-Chan is written in Rust and uses Tauri to create a native application.

You need to have Rust and Node.js installed on your system to build Spotii-Chan.

```bash
# Clone the repository
git clone https://github.com/yashraj-n/Spotii-Chan/ 

# Change directory
cd Spotii-Chan

# Install dependencies
yarn

# Run the application
yarn tauri dev

# Build the application
yarn tauri build

```

This is created using create-tauri-app with [Next.js template](https://tauri.app/v1/guides/getting-started/setup/next-js/)

> ⚠️ As a Rust beginner, I'm sure there are a lot of mistakes in the code. Please feel free to open an issue or a PR if you find any. There are occurence of `unwrap()` and `expect()` in the code which I will remove in the future.

## Screenshots

Search for a song.
<p align="center">
    <img src="./assets/search_demo.png" width="550">

<br>
Search Song from Spotify URL/URI.
<p align="center">
    <img src="./assets/lookup_demo.png" width="550">

<br>
Search the song using the YouTube URL.
<p align="center">
    <img src="./assets/yt_url_demo.png" width="550">

<br>
Download the song.
<p align="center">
    <img src="./assets/yt_download_demo.png" width="550">

<p align="center">
    <img src="./assets/downloaded.png" width="550">

Downloads
<p align="center">
    <img src="./assets/downloads.png" width="550">

## License
[MIT](./LICENSE)

