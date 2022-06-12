require('dotenv').config();
const { ApolloError } = require('apollo-server');
const User = require('./db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const resolvers = {
    Query: {
        user: async (_, {id}, req) => {
            //Applying the middleware
            if (!req.isAuth) {
                throw new ApolloError('Unauthenticated!')
            }
            await User.findById(id);
        },
        users: async () => { return await User.find() }
    },
    Mutation: {
        registerUser: async (_, {registerInput: {username, email, password }}, context, info) => {

            //See if the user exists with email attempting to register
            const oldUser = await User.findOne({ email });  

            //Throw an error if the user exists
            if (oldUser) {
                throw new ApolloError('A user is already registered with the email' + email, 'USER_ALREADY_EXISTS');
            }

            // Encrypt password
            try {
                //const encryptedPassword = await bcrypt.hash(password, 10);

                const user = new User({ username, email, password });

                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: "2h"
                    }
                );
                console.log(process.env.ACCESS_TOKEN_SECRET);
                user.token = token;
                await user.save();
                return user; 

            } catch (err) {
                console.log(err);
            }
        },
        loginUser: async (_, { loginInput: { email, password } }) => {
            //See if the user exists with the email
            const user = await User.findOne({ email });
            //Check if the entered password equals the encrypted password
            if (user && (await bcrypt.compare(password, user.password))) {
                // Create a NEW token
                const token = jwt.sign(
                    { user_id: user._id, email },
                    process.env.ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: "2h"
                    }
                );
                //Attach token to the user model that we found above
                user.token = token;

                return {
                    id: user.id,
                    ...user._doc
                }

            } else {
                //If user doens't exist - return error
                if (!user) {
                throw new ApolloError('You are not registered', 'NOT_REGISTERED')
                } else {
                    throw new ApolloError('Wrong credentials', 'INCORRECT')
                }
            }
        }
    }
    
}

module.exports = resolvers;