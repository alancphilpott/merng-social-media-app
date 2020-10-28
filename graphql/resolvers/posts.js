const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const { validateCreatePost } = require("../../util/validators");

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId);

                if (post) {
                    return post;
                } else {
                    throw new Error("Post Not Found");
                }
            } catch (err) {
                throw new Error("Caught An Error => " + err);
            }
        }
    },
    Mutation: {
        createPost: async (_, { body }, context) => {
            const user = checkAuth(context);

            const { valid, errors } = validateCreatePost(body);
            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            context.pubSub.publish("NEW_POST", {
                newPost: post
            });

            return post;
        },
        deletePost: async (_, { postId }, context) => {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if (post) {
                    if (user.username === post.username) {
                        await post.deleteOne();
                        return "Post Deleted Successfully";
                    } else {
                        throw new AuthenticationError("Action Not Allowed");
                    }
                }
            } catch (err) {
                throw new Error("Caught An Error => " + err);
            }
        },
        likePost: async (_, { postId }, context) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find((like) => like.username === username)) {
                    // Post Already Liked - Unlike It
                    post.likes = post.likes.filter(
                        (like) => like.username !== username
                    );
                } else {
                    // Post Not Liked - Like It
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;
            } else throw new UserInputError("Post Not Found");
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubSub }) => pubSub.asyncIterator("NEW_POST")
        }
    }
};
