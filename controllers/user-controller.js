const { User, Thought } = require('../models');

const userController = {
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found.' });
                    return;
                }
                Thought.deleteMany({ username: dbUserData.username })
                    .then(() => {
                        res.json({ message: 'User deleted.' });
                    }
                    );
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .sort({ _id: -1 })
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate([
                { path: 'thoughts', select: '-__v' },
                { path: 'friends', select: '-__v' }
            ])
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found.' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found.' });
                    return;
                }
                res.json(dbUserData);
            }
            )
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found.' });
                    return;
                }
                res.json(dbUserData);
            }
            )
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            }
            );
    }
};

module.exports = userController;