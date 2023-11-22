import mongoose from "mongoose";
import UsersDao from '../../src/dao/Users.dao.js'
import chai from "chai";

mongoose.connect(`mongodb+srv://juanpc87:juan123@codercluster.xxnkdzq.mongodb.net/ecommerce?retryWrites=true&w=majority`);

const expect = chai.expect;

describe('Testing Users Dao', () => {
    before(function(){
        this.usersDao = new UsersDao();
    });

    beforeEach(function(){
        this.timeout(5000);
        mongoose.connection.collections.users.drop();
    });

    it('El dao debe devolver los usuarios en formato de arreglo.', async function(){
        //Given
        let emptyArray = [];
        //Then
        const result = await this.usersDao.get();
        console.log("Resultado obtenido con el Dao: get()");
 
        //Assert that
        console.log(result);
        expect(result).to.be.deep.equal(emptyArray);
        expect(Array.isArray(result)).to.be.ok;
        expect(Array.isArray(result)).to.be.equal(true);
        expect(result.length).to.be.deep.equal(emptyArray.length);
    });

    it('El Dao debe agregar el usuario correctamente a la BD.', async function(){
        //Given 
        let mockUser = {
            first_name: "Usuario",
            last_name: "Apellido",
            email: "adminCoder@coder.com",
            age: 30,
            password: "1234jp",
            role: "admin",
            cart: "111aaa",
        };

        //Then
        const result = await this.usersDao.save(mockUser);
        //Assert that
        expect(result._id).to.be.ok;
    });
    
    afterEach(function(){
        mongoose.connection.collections.users.drop();
    });
});