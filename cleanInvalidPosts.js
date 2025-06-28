// // // cleanInvalidPosts.js
// // require('dotenv').config();
// // const { MongoClient, ObjectId } = require('mongodb');

// // async function cleanInvalidUserPosts() {
// //   const uri = process.env.MONGO_URI; // Change this if using remote DB or different port
// //   const client = new MongoClient(uri);

// //   try {
// //     await client.connect();
// //     const db = client.db('soulreads'); // <-- Replace with your DB name
// //     const usersCollection = db.collection('users');

// //     const usersWithInvalidPosts = await usersCollection.aggregate([
// //       {
// //         $lookup: {
// //           from: 'posts',
// //           localField: 'posts',
// //           foreignField: '_id',
// //           as: 'matchedPosts'
// //         }
// //       },
// //       {
// //         $project: {
// //           posts: 1,
// //           nonMatchingPosts: {
// //             $filter: {
// //               input: '$posts',
// //               as: 'postId',
// //               cond: { $not: { $in: ['$$postId', '$matchedPosts._id'] } }
// //             }
// //           }
// //         }
// //       },
// //       {
// //         $match: {
// //           'nonMatchingPosts.0': { $exists: true }
// //         }
// //       }
// //     ]).toArray();

// //     for (const user of usersWithInvalidPosts) {
// //       console.log(`Cleaning user ${user._id}...`);
// //       await usersCollection.updateOne(
// //         { _id: user._id },
// //         { $pull: { posts: { $in: user.nonMatchingPosts } } }
// //       );
// //     }

// //     console.log('✅ Invalid post references removed.');
// //   } catch (error) {
// //     console.error('❌ Error:', error);
// //   } finally {
// //     await client.close();
// //   }
// // }

// // cleanInvalidUserPosts();

// const { MongoClient, ObjectId } = require('mongodb');
// require('dotenv').config();
// async function deleteOrphanedPosts() {
//     const uri = process.env.MONGO_URI;
//     // const uri = 'your-atlas-uri-here'; // include db name like ?retryWrites=true
//   const client = new MongoClient(uri);

//   try {
//     await client.connect();
//     const db = client.db('soulreads'); // Replace with your actual DB
//     const postsCollection = db.collection('posts');

//     const orphanedPosts = await postsCollection.aggregate([
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'authorId',
//           foreignField: '_id',
//           as: 'authorMatch'
//         }
//       },
//       {
//         $match: {
//           authorMatch: { $size: 0 }
//         }
//       },
//       {
//         $project: {
//           _id: 1
//         }
//       }
//     ]).toArray();

//     const orphanedIds = orphanedPosts.map(post => post._id);

//     if (orphanedIds.length > 0) {
//       const result = await postsCollection.deleteMany({
//         _id: { $in: orphanedIds }
//       });
//       console.log(`✅ Deleted ${result.deletedCount} orphaned posts.`);
//     } else {
//       console.log('✅ No orphaned posts found.');
//     }

//   } catch (error) {
//     console.error('❌ Error:', error);
//   } finally {
//     await client.close();
//   }
// }

// deleteOrphanedPosts();


// const { MongoClient, ObjectId } = require('mongodb');
// require('dotenv').config();
// async function deleteOrphanedComments() {
//     const uri = process.env.MONGO_URI;
//     //   const uri = 'your-mongodb-atlas-uri'; // full URI with credentials
//     const client = new MongoClient(uri);

//     try {
//         await client.connect();
//         const db = client.db('yourDatabaseName');
//         const commentsCollection = db.collection('comments');

//         const orphanedComments = await commentsCollection.aggregate([
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'authorId',
//                     foreignField: '_id',
//                     as: 'userMatch'
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'posts',
//                     localField: 'postId',
//                     foreignField: '_id',
//                     as: 'postMatch'
//                 }
//             },
//             {
//                 $match: {
//                     $or: [
//                         { userMatch: { $size: 0 } },
//                         { postMatch: { $size: 0 } }
//                     ]
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1
//                 }
//             }
//         ]).toArray();

//         const orphanedIds = orphanedComments.map(comment => comment._id);

//         if (orphanedIds.length > 0) {
//             const result = await commentsCollection.deleteMany({
//                 _id: { $in: orphanedIds }
//             });
//             console.log(`✅ Deleted ${result.deletedCount} orphaned comments.`);
//         } else {
//             console.log('✅ No orphaned comments found.');
//         }

//     } catch (err) {
//         console.error('❌ Error:', err);
//     } finally {
//         await client.close();
//     }
// }

// deleteOrphanedComments();
