const { User } = require("../models")

const friendCount = async () => 
    User.aggregate()
        .count('friendCount')
        .then((numberOfFriends) => numberOfFriends);

module.exports = {
    // Get all Users
    getUsers(req,res) {
        User.find()
        .then(async (users) => {
            const userObj = {
                users,
                friendCount: await friendCount(),
            };
            return res.json(userObj);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        });
    },

    createUser(req,res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err)
        });
    },

    // Get single User
    getSingleUser(req,res) {
        User.findOne({ _id: req.params.userId })
        .select('-__v')
        .then(async (user) => 
        !user 
            ? res.status(404).json({message: 'No user with that ID located'})
            : res.json({
                user
            })
        ) 
        .catch((err) => {
            console.log(err)
            return res.status(500).json(err);
        })
    },

    updateUser(req,res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID located' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
    },

    deleteUser(req,res) {
        User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID located' })
            : User.deleteOne({ _id: req.params.User })
        )
        .then(() => res.json({ message: 'Friend and user deleted successfully' }))
        .catch((err) => res.status(500).json(err));
    }

}