import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    rooms: defineTable({
        roomId: v.string(),
        creatorId: v.string(),
        status: v.union(v.literal("waiting"), v.literal("in-progress"), v.literal("finished")),
        startTime: v.optional(v.number()),
        text: v.string(), // The text prompt for the race
    }).index("by_roomId", ["roomId"]),

    players: defineTable({
        roomId: v.string(),
        name: v.string(),
        progress: v.number(), // Percentage 0-100
        wpm: v.number(),
        accuracy: v.number(),
        finished: v.boolean(),
        finishTime: v.optional(v.number()),
    }).index("by_roomId", ["roomId"]),
});
