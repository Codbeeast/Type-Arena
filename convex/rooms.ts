import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new room
export const create = mutation({
    args: {
        roomId: v.string(),
        creatorId: v.string(),
        creatorName: v.string(),
    },
    handler: async (ctx, args) => {
        // Random text prompt for the race
        const texts = [
            "The quick brown fox jumps over the lazy dog. Speed is nothing without accuracy.",
            "In the future, typing battles will decide the fate of humanity. Are you ready?",
            "Code is poetry written in a language that machines understand and humans appreciate.",
            "React Three Fiber brings the power of WebGL to the declarative world of React.",
        ];
        const randomText = texts[Math.floor(Math.random() * texts.length)];

        const roomId = await ctx.db.insert("rooms", {
            roomId: args.roomId,
            creatorId: args.creatorId,
            status: "waiting",
            text: randomText,
        });

        // Add creator as the first player
        await ctx.db.insert("players", {
            roomId: args.roomId,
            name: args.creatorName,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            finished: false,
        });

        return roomId;
    },
});

// Join an existing room
export const join = mutation({
    args: {
        roomId: v.string(),
        playerName: v.string(),
    },
    handler: async (ctx, args) => {
        const room = await ctx.db
            .query("rooms")
            .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
            .first();

        if (!room) {
            throw new Error("Room not found");
        }

        if (room.status !== "waiting") {
            throw new Error("Race already started");
        }

        await ctx.db.insert("players", {
            roomId: args.roomId,
            name: args.playerName,
            progress: 0,
            wpm: 0,
            accuracy: 100,
            finished: false,
        });

        return room._id;
    },
});

// Get room details
export const getRoom = query({
    args: { roomId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("rooms")
            .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
            .first();
    },
});

// Get players in a room
export const getPlayers = query({
    args: { roomId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("players")
            .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
            .collect();
    },
});

// Start the race
export const startRace = mutation({
    args: { roomId: v.string() },
    handler: async (ctx, args) => {
        const room = await ctx.db
            .query("rooms")
            .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
            .first();

        if (!room) throw new Error("Room not found");

        await ctx.db.patch(room._id, {
            status: "in-progress",
            startTime: Date.now(),
        });
    },
});

// Update player progress
export const updateProgress = mutation({
    args: {
        roomId: v.string(),
        playerName: v.string(),
        progress: v.number(),
        wpm: v.number(),
        accuracy: v.number(),
        finished: v.boolean(),
    },
    handler: async (ctx, args) => {
        const player = await ctx.db
            .query("players")
            .withIndex("by_roomId", (q) => q.eq("roomId", args.roomId))
            .filter((q) => q.eq(q.field("name"), args.playerName))
            .first();

        if (player) {
            await ctx.db.patch(player._id, {
                progress: args.progress,
                wpm: args.wpm,
                accuracy: args.accuracy,
                finished: args.finished,
                finishTime: args.finished ? Date.now() : undefined,
            });
        }
    },
});
