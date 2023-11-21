import chai from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import {
    generateMockProduct
} from "../mocking/utils.mock.js";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Test de integracion de ecommerce", () => {
    before(async function () {
        this.cookie = {};
    });

    describe("Test de sesion de api", () => {
        before(async function () {
            this.mockUser = {
                first_name: "Usuario",
                last_name: "Apellido",
                email: "adminCoder@coder.com",
                age: 30,
                password: "1234jp",
                role: "admin",
                cart: "111aaa",
            };
        });

        it("Registrar usuario - POST /api/sessions/register", async function () {
            const registerResponse = await requester
                .post("/api/sessions/register")
                .send(this.mockUser);
            expect(registerResponse.statusCode).to.equal(200);
        });
        it("Debería hacer el login del usuario y setearle la cookie - POST /api/sessions/login", async function () {
            const loginResponse = await requester
                .post("/api/sessions/login")
                .send({
                    email: this.mockUser.email,
                    password: this.mockUser.password
                });

            expect(loginResponse.statusCode).to.equal(200);
            // Extraer solo el valor de la cookie
            this.cookie = loginResponse.headers["set-cookie"][0].split(";")[0];
            console.log("Cookie after login:", this.cookie);
        });
    });

    describe("Api test para productos", () => {
        describe("Testing de las rutas de productos", () => {
            it("El metodo GET trae todos los productos del array - GET /api/products", async () => {
                const response = await requester.get("/api/products");
                const {
                    statusCode,
                    ok,
                    _body
                } = response;
                expect(statusCode).to.be.eql(200);
                expect(ok).to.be.true;
                expect(_body.payload).to.be.an("array");
            });
            it("Obtengo un producto (ejemplo) por su ID - GET /api/products/652b29ce8b1c2751a6e223bf", async function () {
                console.log("Using cookie in request:", this.cookie);

                const productMock = generateMockProduct();
                const createProductResponse = await requester
                    .post("/api/products")
                    .set("Cookie", this.cookie)
                    .send(productMock);

                expect(createProductResponse.statusCode).to.equal(201);

                const productId = createProductResponse.body._id;
                const getProductResponse = await requester
                    .get(`/api/products/${productId}`)
                    .set("Cookie", this.cookie);

                const {
                    statusCode,
                    ok,
                    _body
                } = getProductResponse;
                expect(ok).to.be.true;
                expect(_body.payload).to.be.an("object");
                expect(_body.payload).to.have.property("_id", productId);
            });
        });
        describe("El usuario esta loggeado y tiene un rol", () => {
            it("Deberia crear un producto si estas loggeado y tu rol lo permite - POST /api/products/", async function () {
                const productMock = generateMockProduct();
                const createProductResponse = await requester
                    .post("/api/products")
                    .set("Cookie", this.cookie)
                    .send(productMock);
                expect(createProductResponse.statusCode).to.be.eql(201);
            });
        });
        describe("Usuario no loggeado", () => {
            it("Si se quiere crear un producto sin estar loggeado, deberia retornar un status 401 - POST /api/products", async function () {
                const productMock = generateMockProduct();
                const {
                    statusCode,
                    ok
                } = await requester
                    .post("/api/products")
                    .send(productMock);
                expect(ok).to.be.not.ok;
                expect(statusCode).to.be.eql(401);
            });
        });
    });

    describe("Testeo para las rutas de carts", () => {
        it("Obtengo todos los carts con el metodo GET - GET /api/carts", async () => {
            const response = await requester.get("/api/carts");
            const {
                statusCode,
                ok,
                _body
            } = response;
            expect(statusCode).to.be.eql(201);
            expect(ok).to.be.true;
            expect(_body.payload).to.be.an("array");
        });
        it("Obtengo un cart por su ID - GET /api/carts/655d41dc66a74e6d35cdf119", async () => {
            const response = await requester.get(
                "/api/carts/655d41dc66a74e6d35cdf119"
            );
            const {
                statusCode,
                ok,
                _body
            } = response;
            expect(statusCode).to.be.eql(200);
            expect(ok).to.be.true;
            expect(_body.payload).to.be.an("object");
        });
        it("Crea un cart con el metodo POST", async () => {
            const response = await requester.post("/api/carts");
            const {
                statusCode,
                ok,
                _body
            } = response;
            expect(statusCode).to.be.eql(200);
            expect(ok).to.be.true;
            expect(_body.payload).to.be.an("array");
        });
    });
});