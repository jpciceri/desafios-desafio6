class DTOFactory {
    createUserDTO(user) {
        console.log("User data before creating DTO in factory:", user);
        return new UserDTO(user);
    }

    createProductDTO(product) {
        return new ProductDTO(product);
    }

    createCartDTO(cart) {
        return new CartDTO(cart);
    }

    createMessageDTO(message) {
        return new MessageDTO(message);
    }
}