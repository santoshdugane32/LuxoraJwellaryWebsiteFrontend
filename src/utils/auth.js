
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
    console.error("Failed to read stored user:", error);
    return null;
  }
};

export const getCartKey = () => {
  const user = getUser();

  if (!user) {
    return null;
  }

  const identifier = user.id ?? user.email;

  if (identifier === null || identifier === undefined || identifier === "") {
    return null;
  }

  return `lux_cart_${String(identifier).trim().toLowerCase()}`;
};
