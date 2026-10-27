
export const getUser = () => {
  try {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    const user = JSON.parse(storedUser);

    if (!user || typeof user !== "object" || Array.isArray(user)) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

export const getCartKey = () => {
  const user = getUser();

  if (!user) {
    return "cart_guest";
  }

  const identifier = user.id ?? user.email;

  if (
    identifier === null ||
    identifier === undefined ||
    String(identifier).trim() === ""
  ) {
    return "cart_guest";
  }

  return `cart_${String(identifier).trim().toLowerCase()}`;
};
