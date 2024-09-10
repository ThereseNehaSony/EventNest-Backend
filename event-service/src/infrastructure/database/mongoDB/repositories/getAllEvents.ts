import {Event } from "../models/event"

export const getAllEvents = async () => {
 // console.log("🚀 ~ file: getAllMovies.ts:4 ~ getAllMovies ~ page:", page)
  try {
   // const skip = (page - 1) * limit;
   const today = new Date()

    const events = await Event.find({startDate:{$gt:today}})
    const totalDocuments = await Event.countDocuments({startDate:{$gt:today}});
   // console.log("🚀 ~ file: getAllEvents.ts:9 ~ getAllEvents ~ totalDocuments:", totalDocuments)
   // const totalPage = Math.ceil(totalDocuments/limit)
    const data = {
      events,
     // totalPage
    }
    return data
  } catch (error:any) {
    throw new Error(error.message)
  }
}