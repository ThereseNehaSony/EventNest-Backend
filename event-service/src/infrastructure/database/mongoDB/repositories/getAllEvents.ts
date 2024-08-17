import {Event } from "../models/event"

export const getAllEvents = async ({page, limit}: any) => {
  console.log("🚀 ~ file: getAllMovies.ts:4 ~ getAllMovies ~ page:", page)
  try {
    const skip = (page - 1) * limit;
    const events = await Event.find().skip(skip).limit(limit)
    const totalDocuments = await Event.countDocuments();
    console.log("🚀 ~ file: getAllEvents.ts:9 ~ getAllEvents ~ totalDocuments:", totalDocuments)
    const totalPage = Math.ceil(totalDocuments/limit)
    const data = {
      events,
      totalPage
    }
    return data
  } catch (error:any) {
    throw new Error(error.message)
  }
}