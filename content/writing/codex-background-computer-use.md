---
title: "How Codex Does Computer Use Without Stealing Focus"
date: "2026-04-24"
description: "Codex can operate your computer in the background. Here's how that works on macOS, and what I learned reproducing it."
tags: ["macos", "computer-use", "codex", "ai-agent"]
pinned: false
---

Every computer-use agent I've tried has the same problem -- it takes over your screen. The agent needs to click, type, scroll, and while it does that, you watch. Your foreground app loses focus, windows shuffle around, and you can't do anything until it's done.

Codex does something different. It operates in the background -- your editor stays focused, your cursor stays put, and the agent works in a window you're not looking at. That turns computer use from "sit and wait" into something that runs alongside your actual work.

I wanted to understand how this works on macOS, so I wrote [ghostpoke](https://github.com/yushaw/ghostpoke) -- a small proof-of-concept that reproduces the same behavior. Full credit to the Codex team for the approach.

## Why focus-stealing is the default

On macOS, input events flow through a central window server. When you click a window, the window server does two things: activates that window (bringing it to focus), then delivers the click. These two steps are coupled by design -- macOS assumes that if you're interacting with a window, you want it in front.

Any tool that sends events through the normal path will activate the target window as a side effect. There's no "click here but don't change focus" option in the standard APIs.

## The key: CGEventPostToPid

macOS has a lower-level function that most automation tools ignore: `CGEventPostToPid`. Instead of posting events to the window server (which manages focus), it posts directly to a process by PID. The event goes straight into the target app's responder chain, bypassing focus management entirely.

The challenge is constructing the event correctly -- a bare CGEvent doesn't carry enough routing context for the target app to know which window it's for. Here's the essential flow, simplified:

```
find target window by app name
  -> get window number, PID, and screen position

create NSEvent(type, screen_point, window_number)
  -> gives us an event bound to a specific window

convert to CGEvent
  -> set WINDOW_UNDER_MOUSE       = window_number
  -> set WINDOW_CAN_HANDLE_EVENT  = window_number
  -> set location                 = screen_point

CGEventPostToPid(pid, cg_event)
  -> delivered directly to process, no focus change
```

That last line is the whole point. The event reaches `NSWindow.sendEvent()` without touching the window server's activation logic. The foreground app never knows anything happened.

This works for click, key, and drag -- three of the five input types an agent needs.

## Chromium's exception

The remaining two -- mouse move and scroll -- get silently dropped by Chromium when the app is in the background. Chromium registers tracking areas with `NSTrackingActiveInActiveApp`, so macOS only delivers mouse-move events to the frontmost app. Scroll events are routed by physical cursor position, which won't be over the background window.

The workaround: Chrome DevTools Protocol. `Input.dispatchMouseEvent` injects events directly into the Blink rendering pipeline, bypassing AppKit entirely.

## Demo

Here's ghostpoke running all five event types -- click, key, scroll, drag, and move -- against a background Electron app while TextEdit stays in focus the entire time.

<video src="/ghostpoke-demo.mp4" controls playsinline muted style="width:100%;border-radius:8px;margin-top:8px"></video>

## What's next

I'm planning to bring this into [sanqian](https://sanqian.ai) so the agent can operate apps in the background without interrupting your work.
