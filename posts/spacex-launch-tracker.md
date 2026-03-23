---
title: "Building the SpaceX Launch Tracker App"
date: "2025-06-16"
excerpt: "A React Native mobile application designed to interact with the official SpaceX API to retrieve and display rocket launch data."
category: "React Native"
readTime: "6 min"
language: "en"
---

![SpaceX API](/img/spaceXApi.jpg)

This project documents the development of a mobile application built with React Native, designed to interact with the official SpaceX API. The app retrieves and displays structured data about rocket launches, providing users with access to detailed mission information, launch timelines, vehicles, and payloads. 

The technical process includes API integration techniques, asynchronous data fetching, state management, and UI composition optimized for mobile devices. Each entry reflects the architectural choices, implementation challenges, and iterative improvements carried out across the app’s lifecycle.

---

## Project Setup (June 15, 2025)

The goal of the app is to provide users with a simple and accessible way to view information about upcoming and past launches — including mission details, launch dates, rockets, and payloads — all within a clean mobile interface.

In this initial stage, I focused on getting the project up and running:
* **Setting up the React Native environment**
* **Installing base dependencies**
* **Organizing the folder structure**
* **Defining core tools**

This post sets the foundation. Future updates will cover API integration, data handling, UI components, and the decisions made along the way as the app takes shape. The idea is to document the full process, including challenges, as transparently as possible.

[View the GitHub repository here](https://github.com/BambuBlu/spacex-launch-tracker-app)

---

## App Flow and Architecture — Part 1

Now that the foundation of the SpaceX Launch Tracker App is in place, the next step was getting real data into the project. This post covers how the app fetches launch data from the SpaceX API, and how I structured that data for quick access and clean rendering.

### └ Connecting to the SpaceX API

![Basic Diagram](/img/basicDiagram.webp)

From the start, the app connects to the public SpaceX API, which provides detailed launch data. The two key endpoints used are:

```text
/launches/past — for completed launches
/launches/upcoming — for planned future launches
```

When the app starts, both endpoints are queried immediately. The results are stored in two global variables (for now, using simple module-level JS variables), one for past launches and one for upcoming launches.

### └ Data Structures and Optimization
Rather than working with the full launch objects across the app — which are large and include a lot of unnecessary metadata — I created two additional structures:

A list of launch names (for things like search, random selection, etc.)

A dictionary mapping each launch name to its full object (for fast lookups)

This allows me to keep rendering and navigation fast and lightweight, without repeatedly traversing massive arrays or re-parsing nested objects.

### └ Why This Structure?
Fetching and storing the data once — and then slicing it into helper structures — reduces overhead in the UI and navigation layers. Instead of repeatedly filtering or looping through large arrays, the app can look up exactly what it needs when it needs it.

This approach also keeps the UI components clean and focused. They don't need to know about the shape of the full API — just the launch name or ID they're working with.

---

### App Flow and Architecture — Part 2
With data fetching and internal organization in place, the next major focus was on structuring the app’s navigation flow and building the first versions of the core screens. This post walks through the screen layout, how routing works with parameters, and some of the reasoning behind key design choices.

### └ Navigation and Screens Overview
After fetching data, the app moves into its navigation flow, handled via React Navigation. Here’s how it's structured:

1. Home Screen: The main hub after data is loaded. It offers three ways to view a specific launch:

Latest Launch – shows the most recent result from the past launches

Search – allows a user to look up by name

Random Launch – selects one from either list
(It also displays a Stat Sheet that links to the Launch List Screen)

2. Launch Screen: This screen shows details about a specific launch. It receives the launch name (or an identifier) as a parameter and:

Looks up the corresponding full data from the dictionary

Displays info like mission name, flight number, date, mission patch, and links

3. Launch List Screen: This screen lists launches by category (Completed → past launches, Planned → upcoming launches). It receives a filter parameter and displays a scrollable list, with basic info and tap-to-view navigation into the Launch Screen.

4. Persistent Refresh Button: This refresh button appears in the top-right corner of the header on all main screens. Pressing it re-fetches data from the SpaceX API and updates all internal structures without restarting the app.

└ Design Decisions
A few key decisions made during this phase:

Global state via module variables: This is a temporary solution — state management may be refactored later using React Context or Redux if the app grows.

Scoped feature set: For now, I’m focusing only on launch data, not covering rockets, payloads, or crew info. The idea is to build something solid, then consider expanding.