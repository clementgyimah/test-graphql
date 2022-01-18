const { User } = require('./models');
const { Beer } = require('./models');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const JWT_SECRET = require('./constants');

const resolvers = {
    Query: {
        async current(_, args, { user }) {
            // console.log('The user: ', user);
            if (user) {
                return await User.findOne({ where: { id: user.id } });
            }
            throw new Error("Sorry, you're not an authenticated user");
        },
        async beer(_, { id }, { user }) {
            if (user) {
                return await Beer.findByPk(id);
            }
            throw new Error('Sorry, you\'re not an authenticated user');
        },
        async beers(_, { brand }, { user }) {
            // console.log('The brand: ', brand);
            if (user) return Beer.findAll({ where: { brand } });
            throw new Error('Sorry, you\'re not an authenticated user');
        },
        async getAllBeers(_, {}, {user}) {
            if (user) return Beer.findAll();
            throw new Error('Sorry, you\'re not an authenticated user');
        }
    },

    Mutation: {
        async register(_, { name, username, email, password }) {
            const user = await User.create({
                name,
                username,
                email,
                password: await bcrypt.hash(password, 10),
            });

            return jsonwebtoken.sign({ id: user.id, name: user.name, username: user.username, email: user.email }, JWT_SECRET, {
                expiresIn: '3m',
            })
        },

        async login(_, { email, password }) {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error(
                    'This user doesn\'t exist, Please make sure to type right credentials'
                );
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                throw new Error('Your password is incorrect')
            }

            return jsonwebtoken.sign({ id: user.id, login: user.email }, JWT_SECRET, {
                expiresIn: '1d'
            });
        },
        async addBeer(_, { name, brand, price }) {
            const beer = Beer.create({
                name,
                brand,
                price
            });
            return `A beer successfully added`
        }
    },
};

module.exports = resolvers;
