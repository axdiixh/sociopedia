import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            pictureToPath,
            friends,
            location,
            occupation,
        } = req.body

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            pictureToPath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        })

        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }
        
        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return res.status(400).json({ message: "Invalid Credentials." })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        delete user.password
        res.status(200).json({ token, user })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}