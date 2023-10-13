import userModel from "./models/user.model.js";
import {
    createHash,
    isValidPassword
} from "../../utils.js";
import UserDTO from "./dto/user.dto.js";

class UserManager {
    async addUser({
        first_name,
        last_name,
        email,
        age,
        password,
        role
    }) {
        try {
            const existingUser = await userModel.findOne({
                email
            });

            if (existingUser) {
                console.log("User already exists");
                return null;
            }

            const hashedPassword = createHash(password);
            const user = await userModel.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword,
                role
            });

            console.log("User added!", user);
            return new UserDTO(user);
        } catch (error) {
            console.error("Error adding user:", error);
            throw error;
        }
    }
    async login(user, pass) {
        try {
            const userLogged = await userModel.findOne({
                email: user
            });

            if (userLogged && isValidPassword(userLogged, pass)) {
                return new UserDTO(userLogged);
            }
            return null;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    }

    async restorePassword(email, hashedPassword) {
        try {
            const user = await userModel.findOne({
                email
            });
            if (!user) {
                console.log("Usuario no encontrado.");
                return false;
            }

            user.password = hashedPassword;

            await user.save();

            console.log("Contraseña restaurada correctamente.");
            return true;
        } catch (error) {
            console.error("Error restoring password:", error);
            return false;
        }
    }
}

export default UserManager;