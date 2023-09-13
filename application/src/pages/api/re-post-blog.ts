// Not in use ATM

// import { NextApiRequest, NextApiResponse } from "next"
// import clientPromise from "@/utils/mongodb"
// import { ObjectId } from "mongodb"
// import { Viper } from "@/types/viper"

// export default async function (req: NextApiRequest, res: NextApiResponse) {
//     const body = req.body

//     const client = await clientPromise
//     const db = client.db("viperDb").collection<Viper>("users")
//     const isRePosted = await db
//         .aggregate([
//             {
//                 $match: {
//                     _id: new ObjectId(body.viper_id),
//                 },
//             },
//             {
//                 $unwind: "$blogRePosts",
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     blogRePosts: 1,
//                 },
//             },
//             {
//                 $match: {
//                     "blogRePosts.blogOwner_id": new ObjectId(body.blogOwner_id),
//                     "blogRePosts._id": new ObjectId(body._id),
//                     "blogRePosts.viper_id": new ObjectId(body.viper_id),
//                 },
//             },
//         ])
//         .toArray()

//     if (isRePosted.length === 0) {
//         try {
//             const viperBlog = await db.findOneAndUpdate(
//                 {
//                     _id: new ObjectId(body.viper_id),
//                 },
//                 {
//                     $push: {
//                         blogRePosts: {
//                             blogOwner_id: new ObjectId(body.blogOwner_id),
//                             _id: new ObjectId(body._id),
//                             viper_id: new ObjectId(body.viper_id),
//                             timestamp: Date.now(),
//                         },
//                     },
//                 }
//             )

//             const blogRePost = await db.findOneAndUpdate(
//                 {
//                     _id: new ObjectId(body.blogOwner_id),
//                     blog: {
//                         $elemMatch: {
//                             _id: new ObjectId(body._id),
//                         },
//                     },
//                 },
//                 {
//                     $push: {
//                         "blog.$.rePosts": body.viper_id,
//                     },
//                 }
//             )

//             return res.status(200).json(viperBlog)
//         } catch (error) {
//             return res.status(400).json(error)
//         }
//     } else {
//         try {
//             const viperBlog = await db.findOneAndUpdate(
//                 {
//                     _id: new ObjectId(body.viper_id),
//                 },
//                 {
//                     $pull: {
//                         blogRePosts: {
//                             blogOwner_id: new ObjectId(body.blogOwner_id),
//                             _id: new ObjectId(body._id),
//                             viper_id: new ObjectId(body.viper_id),
//                         },
//                     },
//                 }
//             )
//             const blogUndoRePost = await db.findOneAndUpdate(
//                 {
//                     _id: new ObjectId(body.blogOwner_id),
//                     blog: {
//                         $elemMatch: {
//                             _id: new ObjectId(body._id),
//                         },
//                     },
//                 },
//                 {
//                     $pull: {
//                         "blog.$.rePosts": body.viper_id,
//                     },
//                 }
//             )
//             return res.status(200).json(viperBlog)
//         } catch (error) {
//             return res.status(400).json(error)
//         }
//     }
// }
